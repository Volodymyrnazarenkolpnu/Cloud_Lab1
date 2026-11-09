resource "azurerm_log_analytics_workspace" "logs" {
  name                = "${var.prefix}-law"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  daily_quota_gb      = 0.1
}

resource "azurerm_monitor_action_group" "alert_group" {
  name                = "${var.prefix}-action-group"
  resource_group_name = azurerm_resource_group.rg.name
  short_name          = "AppAlerts"

  email_receiver {
    name                    = "admin-email"
    email_address           = "volodymyr.nazarenko.ir.2024@lpnu.ua"
    use_common_alert_schema = true
  }
}

resource "azurerm_monitor_metric_alert" "http_5xx_alert" {
  name                = "${var.prefix}-errors"
  resource_group_name = azurerm_resource_group.rg.name
  scopes              = [azurerm_container_app.app.id]
  severity            = 1
  frequency           = "PT1M"
  window_size         = "PT5M"
  criteria {
    metric_namespace = "Microsoft.App/containerapps"
    metric_name      = "Requests"
    aggregation      = "Total"
    operator         = "GreaterThan"
    threshold        = 1

    dimension {
      name     = "statusCodeCategory"
      operator = "Include"
      values   = ["5xx"]
    }
  }

  action {
    action_group_id = azurerm_monitor_action_group.alert_group.id
  }
}

resource "azurerm_monitor_metric_alert" "max_replicas_alert" {
  name                = "${var.prefix}-max-replicas-alert"
  resource_group_name = azurerm_resource_group.rg.name
  scopes              = [azurerm_container_app.app.id]
  description         = "Fires when the container app scales to its maximum replica ceiling."
  severity            = 1
  frequency           = "PT1M"
  window_size         = "PT1M"
  auto_mitigate       = true

  criteria {
    metric_namespace = "microsoft.app/containerapps"
    metric_name      = "Replicas"
    aggregation      = "Maximum"
    operator         = "GreaterThanOrEqual"
    
    threshold        = 4 
  }

  action {
    action_group_id = azurerm_monitor_action_group.alert_group.id
  }
}

resource "azurerm_monitor_metric_alert" "user_spike_alert" {
  name                = "${var.prefix}-user-spike"
  resource_group_name = azurerm_resource_group.rg.name
  scopes              = [azurerm_container_app.app.id]
  severity            = 2
  frequency           = "PT1M"
  window_size         = "PT1M"
  auto_mitigate       = true
  criteria {
    metric_namespace = "Microsoft.App/containerapps"
    metric_name      = "Requests"
    aggregation      = "Total"
    operator         = "GreaterThan"
    threshold        = 5000
  }

  action {
    action_group_id = azurerm_monitor_action_group.alert_group.id
  }
}