#!/bin/bash

## Exit immediately if a command fails
set -e 

PROJECT_ID="sunny-marketplace-testproject"
REGION="us-central1"
REPO_NAME="marketplace-repo"
IMAGE_NAME="landing-page-simple"
IMAGE_TAG="v1" # In a real CI/CD, this would be a dynamic Git commit hash

IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "======================================================"
echo "1. Building and Pushing Image via Google Cloud Build"
echo "======================================================"
## This takes your local code, builds the Docker container, and pushes it to Artifact Registry
gcloud builds submit --tag $IMAGE_URI .

##echo "======================================================"
##echo "2. Applying Terraform Infrastructure"
##echo "======================================================"
#cd terraform

## Initialize Terraform (safe to run multiple times)
#~/bin/terraform init

## Apply the infrastructure using your variables file
#~/bin/terraform apply -var-file="production.tfvars" -auto-approve

#echo "Deployment Complete!"
