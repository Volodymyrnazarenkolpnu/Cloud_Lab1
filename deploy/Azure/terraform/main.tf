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
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}


resource "azurerm_resource_group" "rg" {
  name     = "${var.prefix}-rg"
  location = var.location
  
}

resource "azurerm_container_registry" "acr" {
  name                = "${var.prefix}acr"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
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
  charset             = "utf8mb3"
  collation           = "utf8mb3_general_ci"
}

resource "azurerm_storage_account" "sa" {
  name                     = "${var.prefix}sa"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_queue" "task_queue" {
  name                 = "order-queue"
  storage_account_name   = azurerm_storage_account.sa.name
}

