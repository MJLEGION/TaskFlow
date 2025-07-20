output "acr_login_server" {
  description = "Azure Container Registry login server URL"
  value       = azurerm_container_registry.acr.login_server
}

output "webapp_url" {
  description = "URL of the deployed Azure Web App"
  value       = azurerm_linux_web_app.web.default_hostname
}

output "db_server_name" {
  description = "Azure PostgreSQL server name"
  value       = azurerm_postgresql_flexible_server.db.name
}

output "resource_group_name" {
  description = "Resource group name"
  value       = azurerm_resource_group.main.name
} 