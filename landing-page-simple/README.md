# GCP Marketplace Landing Page - Thank you Page

**DISCLAIMER: This template is provided "AS-IS" for demonstration and structural guidance only. You use this code at your own risk. Google is not responsible for the maintenance, security, or implementation of this template in your production environments.**

A lightweight, production-ready Node.js and Express application designed to serve as a customizable "Thank You" landing page for Google Cloud Marketplace SaaS integrations. This page handles the incoming secure token (`x-gcp-marketplace-token`) redirection upon purchase completion and displays a professional, branded success page to your customers.

For more details on integrating SaaS solutions with Google Cloud Marketplace, check out the official documentation:
https://docs.cloud.google.com/marketplace/docs/partners/integrated-saas

---

## Project Structure

```text
landing-page-simple/
├── .gcloudignore      # Specifies files to omit from container builds
├── deploy.sh          # Automated CI/CD script for building and applying Terraform
├── Dockerfile         # Instructions for building the container image
├── index.html         # Frontend interface (HTML & embedded CSS)
├── index.js           # Backend Express server handling requests & tokens
├── package.json       # Node.js dependencies and run scripts
├── README.md          # Documentation
├── sample-image.png   # Logo
└── terraform/         # Infrastructure as Code (Terraform)
```

---

## Customization

### 1. Update the Product Name
Open `index.html` and locate the text inside the `<p>` tag within the card section:
```html
<p>Your purchase to <strong>Sample Product suite</strong> through Google Cloud Marketplace has been successfully processed.</p>
```
Replace **Sample Product suite** with your actual product name.

### 2. Update the Logo
To display your company or product logo:
1. Replace the file named `sample-image.png` in the root directory with your own logo file (retaining the name `sample-image.png`, or updating the filename in `index.html`).
2. Ensure your logo image is optimized for web viewing.

---

## Local Development & Quick Start

### Prerequisites
- Node.js (v18.x or higher)
- npm

### Installation & Running Locally

1. Clone or download this project folder.
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:8080`.

---

## Option 1: Development / Testing Deployment

To quickly deploy this thank-you page natively on Google Cloud Run for testing purposes (without the enterprise security perimeter):

   ```bash
   gcloud run deploy gcp-marketplace-thankyou \
    --source . --region us-central1 \
    --allow-unauthenticated
   ```

Once deployed, you can use the generated `run.app` URL for testing.

---

## Option 2: Production-Grade Deployment (Terraform & `deploy.sh`)

For real-world production environments, this project includes a `deploy.sh` script that works alongside Terraform to deploy your application behind an enterprise security perimeter (Global Load Balancer + Cloud Armor), satisfying organizational domain restriction policies.

### Production Prerequisites (One-Time Setup)

Before running the deployment script for the first time, you must create an Artifact Registry repository for your container images and a Cloud Storage bucket for Terraform's state file.

1. **Create the Artifact Registry Repository:**
   ```bash
   gcloud artifacts repositories create marketplace-repo \
     --repository-format=docker \
     --location=us-central1
   ```

2. **Create the Terraform State Bucket:**
   ```bash
   # Replace YOUR_PROJECT_ID with your actual project ID
   export TF_STATE_BUCKET="YOUR_PROJECT_ID-tf-state"
   gcloud storage buckets create gs://$TF_STATE_BUCKET --location=us-central1
   gcloud storage buckets update gs://$TF_STATE_BUCKET --versioning
   ```

3. **Update Terraform Backend:**
   Open `terraform/provider.tf` and update the `bucket` value to match the bucket name you just created.

4. **Configure Parameters:**
   * Open `deploy.sh` and update `PROJECT_ID`, `REGION`, and `REPO_NAME` if necessary.
   * Open `terraform/production.tfvars` and ensure your `project_id`, `service_name`, and `image` path reflect your environment.

### Running the Deployment

Whenever you make changes to your application code (like updating the HTML or adding a new logo) or infrastructure, simply run the deployment script:

1. Make the script executable (only needed once):
   ```bash
   chmod +x deploy.sh
   ```

2. Run the deployment:
   ```bash
   ./deploy.sh
   ```

**What `deploy.sh` does:**
1. Packages your source code and uses Google Cloud Build to create a Docker container image (ignoring files specified in `.gcloudignore`).
2. Pushes the new image to your Artifact Registry.
3. Initializes Terraform and applies your infrastructure changes, routing the Load Balancer to the newly built image.

Once deployment completes, Terraform will output a `load_balancer_ip`. You will use this static IP to configure the **Setup URL** inside your Google Cloud Marketplace Partner Portal.
