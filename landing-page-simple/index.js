const express = require('express');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.all('/', (req, res) => {
    if (req.method === 'POST') {
        const token = req.body['x-gcp-marketplace-token'] || '';
        console.log('Received Marketplace Token on thank-you page. Token length:', token.length);
    }

    // Serve the clean, self-contained HTML file directly
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`Thank-You Server listening on port ${port}`);
});