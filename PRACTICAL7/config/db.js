const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/practical7_authdb';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.warn(`[DATABASE WARNING] Could not connect to MongoDB at ${uri}: ${err.message}`);
    console.warn(`[DATABASE NOTICE] Please start your local MongoDB service (net start MongoDB or mongod) or configure MONGO_URI in .env.`);
  }
};

module.exports = connectDB;
