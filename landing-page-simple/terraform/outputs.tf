output "load_balancer_ip" {
  value       = google_compute_global_address.default.address
  description = "The public IP address of the Global External Application Load Balancer"
}

output "cloud_run_service_url" {
  value       = google_cloud_run_v2_service.landing_page_simple.uri
  description = "The internal URI of the Cloud Run service"
}
