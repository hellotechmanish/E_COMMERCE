const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://Root:Admin%40123@ecommerce-site-db.fito8.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce-site-db`
        );
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1); // Exit the process if connection fails
    }
};

module.exports = connectMongoDB;
