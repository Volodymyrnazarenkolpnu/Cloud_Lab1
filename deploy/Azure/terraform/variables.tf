variable "location" {
  description = "Azure region"
  type        = string
  default     = "polandcentral" 
}

variable "prefix" {
  description = "Unique resource prefix"
  type        = string
  default     = "cloudlab1"
}

variable "db_password" {
  description = "MySQL administrator password"
  type        = string
  sensitive   = true
}