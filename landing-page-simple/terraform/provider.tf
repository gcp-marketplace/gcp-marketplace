terraform {
  required_version = ">= 1.5.0"
  
  # Remote backend configuration for storing state in GCS
  backend "gcs" {
    bucket  = "sunny-marketplace-testproject-tf-state"   # Replace with your unique bucket name
    prefix  = "terraform/state/simple-landing-page"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
