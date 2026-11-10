project_id                  = "marketplace-testproject"
service_name                = "gcp-marketplace-simple"
image                       = "us-central1-docker.pkg.dev/marketplace-testproject/marketplace-repo/landing-page-simple:v1"
ingress_type                = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
container_cpu               = "2000m"
rate_limit_exceed_action    = "deny(403)"
rate_limit_count            = 500
