# Google Cloud Marketplace Landing Page - With Database(Firestore) Integration

**DISCLAIMER: This template is provided "AS-IS" for demonstration and structural guidance only. You use this code at your own risk. Google is not responsible for the maintenance, security, or implementation of this template in your production environments.**

A lightweight, serverless Node.js and Express application designed to handle Google Cloud Marketplace customer onboarding. This application serves a custom registration form that captures post-purchase tokens (`x-gcp-marketplace-token`), processes user details, stores them directly in Google Cloud Firestore, and renders a dynamic success confirmation page.

---

## Architecture & Features

* **Google Cloud Marketplace Integration**: Automatically captures the secure JWT token (`x-gcp-marketplace-token`) sent by Google upon purchase redirection and extracts customer identifiers (`sub`).
* **Multi-Product Support**: Features an interactive product selection dropdown (`product-a`, `product-b`) allowing customers to specify their purchased offering directly on the form.
* **Google Cloud Firestore Integration**: Automatically saves customer registration details (Name, Email, Company, Product Name, Google Account ID, Status, and Timestamp) to a dedicated Firestore database (`marketplace-db1`).
* **Modern Google Cloud UI**: Clean, responsive, cloud-themed design styled with standard Google Cloud typography and color accents.
* **Serverless Deployment**: Built for deployment on **Google Cloud Run**.

---

## Project Structure

```text
├── index.html       # Customer setup & registration form frontend
├── index.js         # Express backend server, JWT decoder, and Firestore handler
└── package.json     # Node.js dependencies and start scripts
```

---

## Prerequisites & Environment Setup

* **Google Cloud Project** with billing enabled.
* **Cloud Firestore** enabled in Native mode (with a database ID named `marketplace-db1`).
* **Google Cloud SDK (`gcloud`)** installed and configured.

---

## Local Development & Testing

1. Clone or download the project files into a local directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application locally:
   ```bash
   npm start
   ```
4. Access the app in your browser at `http://localhost:8080`.

---

## Deployment to Google Cloud Run

To deploy the service to Cloud Run using source-based deployment, run the following command in your terminal:

```bash
gcloud run deploy gcp-marketplace-landing-v3 \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

Once deployed, copy the generated service URL and configure it as the **Setup URL** inside your Google Cloud Marketplace Partner Portal.