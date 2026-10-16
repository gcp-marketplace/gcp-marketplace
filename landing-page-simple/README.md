# GCP Marketplace Landing Page - Thank you Page

**DISCLAIMER: This template is provided "AS-IS" for demonstration and structural guidance only. You use this code at your own risk. Google is not responsible for the maintenance, security, or implementation of this template in your production environments.**

A lightweight, production-ready Node.js and Express application designed to serve as a customizable "Thank You" landing page for Google Cloud Marketplace SaaS integrations. This page handles the incoming secure token (`x-gcp-marketplace-token`) redirection upon purchase completion and displays a professional, branded success page to your customers.

For more details on integrating SaaS solutions with Google Cloud Marketplace, check out the official documentation:
https://docs.cloud.google.com/marketplace/docs/partners/integrated-saas

---

## Features

- **Token Handlers:** Safely captures and logs the `x-gcp-marketplace-token` passed by Google Cloud Marketplace via HTTP POST requests upon user purchase or configuration redirection.
- **Modern UI Design:** Styled with a clean, Google-inspired interface complete with custom cloud backgrounds, a success checkmark animation, and support for your company's product logo (`sample-image.png`).
- **Zero Heavy Dependencies:** Built strictly using lightweight Express.js for fast container boot times and minimal vulnerability exposure.

---

## Project Structure

```text
gcp-marketplace-thankyou-v1/
├── index.html       # Frontend interface (HTML & embedded CSS)
├── index.js         # Backend Express server handling requests & tokens
├── package.json     # Node.js dependencies and run scripts
└── README.md        # Documentation
└── sample-image.png # Logo
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

## Deployment to Google Cloud (Cloud Run)

To deploy this thank-you page natively on Google Cloud Run:

   Deploy the service to Cloud Run:
   ```bash
   gcloud run deploy gcp-marketplace-thankyou \
    --source . --region us-central1 \
    --allow-unauthenticated
   ```

Once deployed, copy the generated service URL and configure it as the **Setup URL** inside your Google Cloud Marketplace Partner Portal.