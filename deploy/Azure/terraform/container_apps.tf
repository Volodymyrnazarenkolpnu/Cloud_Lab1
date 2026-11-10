
resource "azurerm_container_app_environment" "env" {
  name                           = "${var.prefix}-env"
  location                       = azurerm_resource_group.rg.location
  resource_group_name            = azurerm_resource_group.rg.name
  infrastructure_subnet_id       = azurerm_subnet.aca_subnet.id
  internal_load_balancer_enabled = true
  log_analytics_workspace_id     = azurerm_log_analytics_workspace.logs.id
  lifecycle {
    ignore_changes = [
      infrastructure_resource_group_name,
    ]
  }
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

  secret {
    name = "storage-connection-string"
    value = azurerm_storage_account.sa.primary_connection_string
  }

  template {
    min_replicas = 0
    max_replicas = 4
    
    custom_scale_rule {
      name = "cpu-scale"
      custom_rule_type = "cpu"
      metadata = {
        type = "Utilization"
        value = "60"
      }
    }

    custom_scale_rule {
      name             = "daytime-schedule"
      custom_rule_type = "cron"
      metadata = {
        timezone        = "UTC"
        start           = "0 8 * * *"
        end             = "0 20 * * *"
        desiredReplicas = "2"
      }
    }
    
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
      env {
        name = "AZURE_TENANT_ID"
        value = "7631cd62-5187-4e15-8b8e-ef653e366e7a"
      }
      env {
        name = "AZURE_CLIENT_ID"
        value = "4aa03e53-cddb-48f7-bfd0-7170c394c6f6"
      }
      env {
        name  = "REDIS_HOST"
        value = azurerm_container_app.redis.name
      }
      env {
        name  = "REDIS_PORT"
        value = "6379"
      }
      env {
        name = "STORAGE_CONNECTION_STRING"
        secret_name = "storage-connection-string"
      }
      env {
        name  = "APPLICATIONINSIGHTS_CONNECTION_STRING"
        value = azurerm_application_insights.appinsights.connection_string
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
  depends_on = [azurerm_container_app.app]

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
    max_replicas = 1

    container {
      name   = "client"
      image  = "mcr.microsoft.com/azuredocs/aci-helloworld:latest"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name = "REACT_APP_CLIENT_ID"
        value = "9cea8173-9764-4508-aa55-47dbb48f76b0"
      }
      env {
        name = "REACT_APP_TENANT_ID"
        value = "7631cd62-5187-4e15-8b8e-ef653e366e7a"
      }
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

resource "azurerm_container_app" "redis" {
  name                         = "${var.prefix}-redis"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  template {
    min_replicas = 1
    max_replicas = 1 

    container {
      name   = "redis"
      image  = "redis:7.2-alpine"
      cpu    = 0.25
      memory = "0.5Gi"
    }
  }

  ingress {
    external_enabled = false
    target_port      = 6379
    exposed_port     = 6379
    transport        = "tcp"
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }
}

resource "azurerm_container_app" "worker" {
  name                         = "${var.prefix}-worker"
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

  secret {
    name  = "storage-connection-string"
    value = azurerm_storage_account.sa.primary_connection_string
  }

  template {
    min_replicas = 1
    max_replicas = 4

    container {
      name  = "worker"
      image = "mcr.microsoft.com/azuredocs/aci-helloworld:latest"
      cpu   = 0.25
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
        name        = "STORAGE_CONNECTION_STRING"
        secret_name = "storage-connection-string"
      }
    }
  }

}
