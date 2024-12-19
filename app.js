const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectMongoDB = require('./config/mongoConfig');
// const mysqlConnection = require('./config/mysqlConfig');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Initialize App
const app = express();

// Load Environment Variables
dotenv.config();

// Middleware
app.use(cors()); // Allow Cross-Origin Requests
app.use(bodyParser.json()); // Parse JSON Requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded Requests
// app.use(express.json());


// Connect to Databases
connectMongoDB(); // Connect to MongoDB
// mysqlConnection; // MySQL Connection is already initialized in config

// Test Route
app.get('/', (req, res) => {
    res.send('Welcome to the eCommerce API');
});

// API Routes
app.use('/user', userRoutes);
app.use('/order', orderRoutes);
app.use('/product', productRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
