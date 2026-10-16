const express = require('express');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
const { Firestore } = require('@google-cloud/firestore');

const app = express();
app.use(express.urlencoded({ extended: true }));

// Allow Express to serve static files
app.use(express.static(__dirname));

// Initialize Firestore with your specific database ID
const firestore = new Firestore({
    databaseId: 'marketplace-db1'
});

const mockDatabase = [];

function decodeJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
}

// 1. Initial Landing Page
app.all('/', (req, res) => {
    let token = '';
    if (req.method === 'POST') {
        token = req.body['x-gcp-marketplace-token'] || '';
        console.log('Received Marketplace Token redirect.');
    }

    let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    html = html.replace('{{MARKETPLACE_TOKEN}}', token);
    
    res.send(html);
});

// 2. Form Submission & Backend Processing
app.post('/setup', async (req, res) => {
    // Extract the 'productName' field from the dropdown submission
    const { name, email, company, productName } = req.body;
    const token = req.body['x-gcp-marketplace-token'];

    try {
        let accountId = 'pending_verification';
        let obfuscatedGoogleId = 'unknown';

        if (token && token !== '{{MARKETPLACE_TOKEN}}') {
            const decodedToken = decodeJwt(token);
            obfuscatedGoogleId = decodedToken.sub; 

            // MOCK MODE CHECK 
            if (token === 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiAib2JmdXNjYXRlZF91c2VyXzEyMyIsICJpc3MiOiAiR29vZ2xlIn0=.fakesignature') {
                console.log('MOCK MODE: Bypassing Google API. Simulating success.');
                accountId = 'E-mock-procurement-id-999';
            } else {
                // REAL API MODE (Commented out for now)
                /*
                const auth = new google.auth.GoogleAuth({
                    scopes: ['https://www.googleapis.com/auth/cloud-platform']
                });
                const authClient = await auth.getClient();
                const procurementApi = await google.discoverAPI(
                    'https://cloudcommerceprocurement.googleapis.com/$discovery/rest?version=v1',
                    { auth: authClient }
                );

                const providerId = \`providers/\${process.env.PROVIDER_ID || 'YOUR_PROVIDER_ID'}\`;
                
                // 1. Resolve token
                const resolveResponse = await procurementApi.providers.entitlements.resolve({
                    parent: providerId,
                    requestBody: { jwt: token }
                });
                accountId = resolveResponse.data.account.id;
                
                // 2. Approve account
                await procurementApi.providers.accounts.approve({
                    name: \`\${providerId}/accounts/\${accountId}\`,
                    requestBody: { approvalName: "signup", reason: "User completed registration" }
                });
                */
                console.log('Real Procurement API logic would trigger here.');
            }
        }

        // ---------------------------------------------------------
        // DATA PREPARATION
        // ---------------------------------------------------------
        const newCustomerData = {
            name,
            email,
            company,
            productName, // Saves the exact string chosen from the dropdown to Firestore
            googleAccountId: accountId,
            obfuscatedGoogleId,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        // Mock DB log
        mockDatabase.push(newCustomerData);
        console.log(`[TEMPLATE LOG] Customer data prepared:`, newCustomerData);

        // ---------------------------------------------------------
        // FIRESTORE INTEGRATION
        // ---------------------------------------------------------
        try {
            // Creates a new document with an auto-generated ID in the 'marketplace_customers' collection
            const customerDoc = firestore.collection('marketplace_customers').doc();
            await customerDoc.set(newCustomerData);
            console.log(`[FIRESTORE] Successfully saved customer data for ${company}. Product: ${productName}`);
        } catch (dbError) {
            console.error(`[FIRESTORE ERROR] Could not save data to Firestore:`, dbError);
        }

        // ---------------------------------------------------------
        // RETURN SUCCESS PAGE
        // ---------------------------------------------------------
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Setup Complete</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
                    
                    body {
                        font-family: 'Roboto', sans-serif;
                        margin: 0;
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: linear-gradient(135deg, #e8f0fe 0%, #d2e3fc 100%);
                        overflow-x: hidden;
                    }
            
                    /* --- CSS CLOUDS BACKGROUND --- */
                    .cloud-bg {
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none;
                    }
                    .cloud { position: absolute; background: rgba(255, 255, 255, 0.7); border-radius: 100px; }
                    .cloud::before, .cloud::after { content: ''; position: absolute; background: rgba(255, 255, 255, 0.7); border-radius: 50%; }
                    .cloud-1 { width: 160px; height: 50px; top: 15%; left: 10%; }
                    .cloud-1::before { width: 70px; height: 70px; top: -30px; left: 20px; }
                    .cloud-1::after { width: 90px; height: 90px; top: -45px; right: 20px; }
                    .cloud-2 { width: 220px; height: 70px; top: 50%; right: 5%; }
                    .cloud-2::before { width: 90px; height: 90px; top: -40px; left: 30px; }
                    .cloud-2::after { width: 120px; height: 120px; top: -60px; right: 30px; }
                    .cloud-3 { width: 120px; height: 40px; bottom: 20%; left: 20%; }
                    .cloud-3::before { width: 50px; height: 50px; top: -20px; left: 15px; }
                    .cloud-3::after { width: 60px; height: 60px; top: -30px; right: 15px; }
            
                    /* --- CARD STYLING --- */
                    .card {
                        background-color: #ffffff; padding: 48px; border-radius: 12px;
                        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); width: 100%; max-width: 420px;
                        box-sizing: border-box; z-index: 1; border-top: 6px solid #34a853; text-align: center;
                    }
                    .success-icon {
                        display: flex; align-items: center; justify-content: center;
                        background: #e6f4ea; border-radius: 50%; width: 72px; height: 72px; margin: 0 auto 24px auto;
                    }
                    h2 { color: #202124; margin: 0 0 16px 0; font-size: 28px; font-weight: 700; }
                    p { color: #5f6368; font-size: 15px; line-height: 1.6; margin-bottom: 32px; }
                    strong { color: #202124; }
                    .btn {
                        display: inline-block; width: 100%; padding: 14px; background-color: #1a73e8; color: white;
                        text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 500;
                        box-sizing: border-box; transition: background-color 0.2s, box-shadow 0.2s;
                    }
                    .btn:hover { background-color: #1557b0; box-shadow: 0 2px 6px rgba(26, 115, 232, 0.3); }
                </style>
            </head>
            <body>
                <div class="cloud-bg">
                    <div class="cloud cloud-1"></div>
                    <div class="cloud cloud-2"></div>
                    <div class="cloud cloud-3"></div>
                </div>
            
                <div class="card">
                    <div class="success-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40" fill="#34a853">
                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                        </svg>
                    </div>
                    
                    <h2>Setup Complete!</h2>
                    
                    <!-- Directly injecting the string from the dropdown -->
                    <p>Thank you for purchasing <strong>${productName}</strong> on Google Cloud Marketplace.</p>
                    
                    <a href="https://docs.cloud.google.com/marketplace/docs" class="btn">Go to Dashboard</a>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error during setup processing:', error);
        res.status(500).send('An error occurred during setup. Please check the logs.');
    }
});

// This block is required for Cloud Run to successfully start the container
const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});