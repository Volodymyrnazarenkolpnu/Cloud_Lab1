output "public_load_balancer_ip" {
  value = azurerm_public_ip.appgw_ip.ip_address
}

output "acr_name" {
  value = azurerm_container_registry.acr.name
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "container_app_name" {
  value = azurerm_container_app.app.name
}