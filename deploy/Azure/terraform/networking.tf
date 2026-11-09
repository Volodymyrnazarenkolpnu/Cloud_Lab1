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
    path                = "/api/health"
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
      paths                      = ["/api/getall", "/api/get/*", "/api/cart", "/api/cart/*", "/api/health"]
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


