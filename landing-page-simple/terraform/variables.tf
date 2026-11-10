variable "project_id" {
  type        = string
  description = "Your Google Cloud Project ID"
}

variable "region" {
  type        = string
  description = "Target GCP region for resources"
  default     = "us-central1"
}

variable "service_name" {
  type        = string
  description = "Base name used for the Cloud Run service and associated resources"
  default     = "gcp-marketplace-thankyou"
}

variable "image" {
  type        = string
  description = "Container image URI in Artifact Registry"
}

# --- Cloud Run Parameters ---
variable "ingress_type" {
  type        = string
  description = "Ingress traffic allowed to the Cloud Run service"
  default     = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
}

variable "container_cpu" {
  type        = string
  description = "CPU limit for the container"
  default     = "1000m"
}

variable "container_memory" {
  type        = string
  description = "Memory limit for the container"
  default     = "512Mi"
}

# --- Cloud Armor Parameters ---
variable "rate_limit_exceed_action" {
  type        = string
  description = "Action to take when rate limit is exceeded (e.g., deny(429), deny(403))"
  default     = "deny(429)"
}

variable "rate_limit_count" {
  type        = number
  description = "Number of requests allowed per interval before enforcing the rate limit"
  default     = 100
}

variable "rate_limit_ban_count" {
  type        = number
  description = "Number of requests allowed before banning the IP"
  default     = 200
}

variable "rate_limit_interval_sec" {
  type        = number
  description = "Time interval in seconds for rate limiting"
  default     = 60
}

variable "rate_limit_ban_duration_sec" {
  type        = number
  description = "Time in seconds to ban an IP that exceeds the ban threshold"
  default     = 300
}
