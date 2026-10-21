const mongoose = require('mongoose');

const connectDB = async () => {
  // Step 5: Uses MongoDB container service name 'mongodb'
  const uri = process.env.MONGO_URI || 'mongodb://mongodb:27017/taskdb';
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[DATABASE] MongoDB connection pending at ${uri}: ${err.message}`);
  }
};

module.exports = connectDB;
