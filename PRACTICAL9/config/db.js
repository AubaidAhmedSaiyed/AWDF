const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/practical9_cachedb';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.log(`[DATABASE] Local MongoDB not reachable at ${uri}.`);
    console.log(`[DATABASE] Initializing in-memory MongoDB fallback for testing...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[DATABASE] Connected to In-Memory MongoDB at ${memUri}`);
      return conn;
    } catch (memErr) {
      console.warn(`[DATABASE] In-memory server could not start (${memErr.message}). Mongoose will retry connection.`);
    }
  }
};

module.exports = connectDB;
