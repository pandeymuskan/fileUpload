const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const uploadRoutes = require('./Routes/upload');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB(); // 🔌 Connect to MongoDB


// Middleware
app.use(express.json());

// Routes
app.use('/', uploadRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
