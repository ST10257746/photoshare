import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

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

// Start the server
app.listen(PORT, () => {
    console.log('server is running')
});