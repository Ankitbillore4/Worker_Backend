const mongoose = require('mongoose');
require('dotenv').config();  
mongoose.set("strictQuery", false);


const connectDB = async () => { 
    try { 
        await mongoose.connect(process.env.MONGO_URI); 
        console.log('MongoDB Connected');
    } catch (error) { 
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}; 

module.exports = connectDB;
