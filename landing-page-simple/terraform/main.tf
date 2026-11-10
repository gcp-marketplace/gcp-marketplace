# 1. CLOUD RUN SERVICE
resource "google_cloud_run_v2_service" "landing_page_simple" {
  name     = var.service_name
  location = var.region
  ingress  = var.ingress_type

  template {
    containers {
      image = var.image
      resources {
        limits = {
          cpu    = var.container_cpu
          memory = var.container_memory
        }
      }
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "noauth" {
  location = google_cloud_run_v2_service.landing_page_simple.location
  name     = google_cloud_run_v2_service.landing_page_simple.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# 2. SERVERLESS NETWORK ENDPOINT GROUP (NEG)
resource "google_compute_region_network_endpoint_group" "serverless_neg" {
  name                  = "${var.service_name}-neg"
  region                = var.region
  network_endpoint_type = "SERVERLESS"
  cloud_run {
    service = google_cloud_run_v2_service.landing_page_simple.name
  }
}

# 3. CLOUD ARMOR SECURITY POLICY
resource "google_compute_security_policy" "security_policy" {
  name        = "${var.service_name}-armor-policy"
  description = "WAF and rate limiting policy for ${var.service_name}"

  rule {
    action   = "allow"
    priority = "2147483647"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Default allow rule"
  }

  rule {
    action   = "rate_based_ban"
    priority = 1000
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Rate limit access"
    rate_limit_options {
      conform_action = "allow"
      exceed_action  = var.rate_limit_exceed_action
      enforce_on_key = "IP"
      rate_limit_threshold {
        count        = var.rate_limit_count
        interval_sec = var.rate_limit_interval_sec
      }
      ban_threshold {
        count        = var.rate_limit_ban_count
        interval_sec = var.rate_limit_interval_sec
      }
      ban_duration_sec = var.rate_limit_ban_duration_sec
    }
  }
}

# 4. GLOBAL EXTERNAL APPLICATION LOAD BALANCER
resource "google_compute_global_address" "default" {
  name = "${var.service_name}-lb-ip"
}

resource "google_compute_backend_service" "default" {
  name                  = "${var.service_name}-backend"
  load_balancing_scheme = "EXTERNAL"
  security_policy       = google_compute_security_policy.security_policy.id

  backend {
    group = google_compute_region_network_endpoint_group.serverless_neg.id
  }
}

resource "google_compute_url_map" "default" {
  name            = "${var.service_name}-url-map"
  default_service = google_compute_backend_service.default.id
}

resource "google_compute_target_http_proxy" "default" {
  name    = "${var.service_name}-http-proxy"
  url_map = google_compute_url_map.default.id
}

resource "google_compute_global_forwarding_rule" "default" {
  name                  = "${var.service_name}-forwarding-rule"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "80"
  target                = google_compute_target_http_proxy.default.id
  ip_address            = google_compute_global_address.default.address
}
