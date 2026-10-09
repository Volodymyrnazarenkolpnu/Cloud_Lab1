output "public_load_balancer_ip" {
  value = azurerm_public_ip.appgw_ip.ip_address
}

output "acr_name" {
  value = azurerm_container_registry.acr.name
}

output "server_aci_name" {
  value = azurerm_container_group.server.name
}

output "client_aci_name" {
  value = azurerm_container_group.client.name
}