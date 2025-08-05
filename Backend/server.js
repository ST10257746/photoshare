import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import https from 'https';

//load env variables
dotenv.config();

//initialise express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Add Basic route
app.get('/', (req, res) => {
    res.send('welcome to photoshare app')
});

// use mkcerts generated certificates for HTTPS
const sslOptions = {
    key: fs.readFileSync('./certs/localhost-key.pem'),
    cert: fs.readFileSync('./certs/localhost.pem')
};

// setup https server
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});


// Start the server
// app.listen(PORT, () => {
//     console.log('server is running')
// });