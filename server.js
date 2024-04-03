const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/gymSignup');
const db = mongoose.connection;

// Check for DB connection
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', (err) => {
    console.error(err);
});

// Serve static files from the project directory
app.use(express.static(path.join(__dirname)));

// Define a MongoDB schema for the data
const formDataSchema = new mongoose.Schema({
    name: String,
    email: String,
    contact: String,
    preferredTimings: String
});

// Define a MongoDB model based on the schema
const FormData = mongoose.model('FormData', formDataSchema);

// POST endpoint to handle form submission
app.post('/submit', (req, res) => {
    const { name, email, contact, preferredTimings } = req.body;

    // Create a new FormData instance
    const formData = new FormData({
        name,
        email,
        contact,
        preferredTimings
    });

    // Save the form data to MongoDB
    formData.save()
        .then(() => {
            res.send('Form data saved successfully');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error saving form data');
        });
});

// Serve hema.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'hema.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
