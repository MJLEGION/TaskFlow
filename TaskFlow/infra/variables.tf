variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
  default     = "taskflow-rg"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "East US"
}

variable "db_name" {
  description = "Name of the PostgreSQL server"
  type        = string
  default     = "taskflow-db"
}

variable "db_admin" {
  description = "PostgreSQL admin username"
  type        = string
  default     = "taskflowadmin"
}

variable "db_password" {
  description = "PostgreSQL admin password"
  type        = string
  sensitive   = true
}

variable "acr_name" {
  description = "Azure Container Registry name (must be globally unique, 5-50 alphanumeric chars)"
  type        = string
  default     = "taskflowacr12345"
}

variable "prefix" {
  description = "Prefix for naming Azure resources"
  type        = string
  default     = "taskflow"
}

variable "webapp_name" {
  description = "Name of the Azure Web App for Containers"
  type        = string
  default     = "taskflow-webapp"
}

variable "docker_image_name" {
  description = "Docker image name (e.g., taskflow-backend:latest)"
  type        = string
  default     = "taskflow-backend:latest"
}

variable "sql_server_name" {
  description = "Azure SQL logical server name (must be globally unique)"
  type        = string
  default     = "taskflowsqlserverYOURNAME"
}

variable "sql_admin" {
  description = "Azure SQL admin username"
  type        = string
  default     = "sqladminuser"
}

variable "sql_password" {
  description = "Azure SQL admin password"
  type        = string
  sensitive   = true
}

variable "sql_db_name" {
  description = "Azure SQL database name"
  type        = string
  default     = "taskflowdb"
} 