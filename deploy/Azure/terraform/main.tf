terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90"
    }
  }
}

provider "azurerm" {
  features {}
}


resource "azurerm_resource_group" "rg" {
  name     = "${var.prefix}-rg"
  location = var.location
}


resource "azurerm_virtual_network" "vnet" {
  name                = "${var.prefix}-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "appgw_subnet" {
  name                 = "appgw-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}


resource "azurerm_subnet" "db_subnet" {
  name                 = "db-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.3.0/24"]

  delegation {
    name = "mysql-delegation"
    service_delegation {
      name    = "Microsoft.DBforMySQL/flexibleServers"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }
}

resource "azurerm_subnet" "aca_subnet" {
  name                 = "aca-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.4.0/23"]

  delegation {
    name = "aca-delegation"
    service_delegation {
      name    = "Microsoft.App/environments"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }
}

resource "azurerm_network_security_group" "db_nsg" {
  name                = "${var.prefix}-db-nsg"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  security_rule {
    name                       = "Allow-From-ACA-Subnet"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3306"
    source_address_prefix      = "10.0.4.0/23"
    destination_address_prefix = "*"
  }
}

resource "azurerm_subnet_network_security_group_association" "db_assoc" {
  subnet_id                 = azurerm_subnet.db_subnet.id
  network_security_group_id = azurerm_network_security_group.db_nsg.id
}


resource "azurerm_container_registry" "acr" {
  name                = "${var.prefix}acr"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
}


resource "azurerm_private_dns_zone" "mysql_dns" {
  name                = "${var.prefix}.mysql.database.azure.com"
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_private_dns_zone_virtual_network_link" "mysql_dns_link" {
  name                  = "mysql-dns-link"
  resource_group_name   = azurerm_resource_group.rg.name
  private_dns_zone_name = azurerm_private_dns_zone.mysql_dns.name
  virtual_network_id    = azurerm_virtual_network.vnet.id
}

resource "azurerm_mysql_flexible_server" "db" {
  name                   = "${var.prefix}-mysql"
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  administrator_login    = "mysqladmin"
  administrator_password = var.db_password
  sku_name               = "B_Standard_B1ms"
  delegated_subnet_id    = azurerm_subnet.db_subnet.id
  private_dns_zone_id    = azurerm_private_dns_zone.mysql_dns.id
  zone                   = "1" 
  
  depends_on = [azurerm_private_dns_zone_virtual_network_link.mysql_dns_link]
}

resource "azurerm_mysql_flexible_database" "db_schema" {
  name                = "WEB"
  resource_group_name = azurerm_resource_group.rg.name
  server_name         = azurerm_mysql_flexible_server.db.name
  charset             = "utf8"
  collation           = "utf8_general_ci"
}

resource "azurerm_container_app_environment" "env" {
  name                           = "${var.prefix}-env"
  location                       = azurerm_resource_group.rg.location
  resource_group_name            = azurerm_resource_group.rg.name
  infrastructure_subnet_id       = azurerm_subnet.aca_subnet.id
  internal_load_balancer_enabled = true
}


resource "azurerm_container_app" "app" {
  name                         = "${var.prefix}-app"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "acr-password"
  }

  secret {
    name  = "acr-password"
    value = azurerm_container_registry.acr.admin_password
  }

  secret {
    name  = "db-password"
    value = var.db_password
  }

  template {
    min_replicas = 1
    container {
      name   = "server"
      image  = "mcr.microsoft.com/azuredocs/aci-helloworld:latest" 
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "DATABASE"
        value = "WEB"
      }
      env {
        name        = "PASSWORD"
        secret_name = "db-password"
      }
      env {
        name  = "HOST"
        value = azurerm_mysql_flexible_server.db.fqdn
      }
      env {
        name  = "USER"
        value = "mysqladmin"
      }
      env {
        name  = "PORT"
        value = "5050"
      }
    }
  }

  ingress {
    external_enabled = true
    allow_insecure_connections = true
    target_port      = 5050
    transport        = "auto"
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }
}

resource "azurerm_container_app" "client" {
  name                         = "${var.prefix}-client"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "acr-password"
  }

  secret {
    name  = "acr-password"
    value = azurerm_container_registry.acr.admin_password
  }

  template {
    min_replicas = 1
    max_replicas = 3

    container {
      name   = "client"
      image  = "mcr.microsoft.com/azuredocs/aci-helloworld:latest"
      cpu    = 0.25
      memory = "0.5Gi"
    }
  }

  ingress {
    external_enabled           = true
    allow_insecure_connections = true
    target_port                = 3000
    transport                  = "auto"
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }
}


resource "azurerm_public_ip" "appgw_ip" {
  name                = "${var.prefix}-gw-ip"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_application_gateway" "appgw" {
  name                = "${var.prefix}-appgw"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  sku {
    name     = "Standard_v2"
    tier     = "Standard_v2"
    capacity = 1
  }

  ssl_policy {
    policy_type = "Predefined"
    policy_name = "AppGwSslPolicy20220101"
  }

  gateway_ip_configuration {
    name      = "appgw-ip-config"
    subnet_id = azurerm_subnet.appgw_subnet.id
  }

  frontend_port {
    name = "http-port"
    port = 80
  }

  frontend_ip_configuration {
    name                 = "appgw-frontend-ip"
    public_ip_address_id = azurerm_public_ip.appgw_ip.id
  }

  backend_address_pool {
    name         = "aca-backend-pool"
    ip_addresses = [azurerm_container_app_environment.env.static_ip_address]
  }


  probe {
    name                = "server-probe"
    protocol            = "Http"
    path                = "/health"
    interval            = 30
    timeout             = 10
    unhealthy_threshold = 3
    port                = 80
    host                = azurerm_container_app.app.ingress[0].fqdn
  }

  backend_http_settings {
    name                  = "server-http-settings"
    cookie_based_affinity = "Disabled"
    port                  = 80
    protocol              = "Http"
    probe_name            = "server-probe"
    host_name             = azurerm_container_app.app.ingress[0].fqdn
    request_timeout       = 20
  }

  probe {
    name                = "client-probe"
    protocol            = "Http"
    path                = "/"
    interval            = 30
    timeout             = 10
    unhealthy_threshold = 3
    port                = 80
    host                = azurerm_container_app.client.ingress[0].fqdn
  }

  backend_http_settings {
    name                  = "client-http-settings"
    cookie_based_affinity = "Disabled"
    port                  = 80
    protocol              = "Http"
    probe_name            = "client-probe"
    host_name             = azurerm_container_app.client.ingress[0].fqdn
    request_timeout       = 20
  }

  http_listener {
    name                           = "http-listener"
    frontend_ip_configuration_name = "appgw-frontend-ip"
    frontend_port_name             = "http-port"
    protocol                       = "Http"
  }

  url_path_map {
    name                               = "url-path-map"
    default_backend_address_pool_name  = "aca-backend-pool"
    default_backend_http_settings_name = "client-http-settings"

    path_rule {
      name                       = "api-routes"
      paths                      = ["/getall", "/get/*", "/cart", "/cart/*", "/health"]
      backend_address_pool_name  = "aca-backend-pool"
      backend_http_settings_name = "server-http-settings"
    }
  }

  request_routing_rule {
    name               = "path-routing-rule"
    rule_type          = "PathBasedRouting"
    http_listener_name = "http-listener"
    url_path_map_name  = "url-path-map"
    priority           = 100
  }
}
