const mongoose = require('mongoose');

const dbUri = 'mongodb+srv://student:ensim@clusterdpe.dly181i.mongodb.net/dpe?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
