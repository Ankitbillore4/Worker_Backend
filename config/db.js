const mongoose = require('mongoose');

mongoose.set("strictQuery", false);


const connectDB = async () => { 
    // console.log(process.env.MONGO_URI)
    try { 
        await mongoose.connect(process.env.MONGO_URI); 
        console.log('MongoDB Connected');
    } catch (error) { 
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}; 




module.exports = connectDB;
