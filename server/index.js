const express = require("express");
const app = express();
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 4000;

// Connect to database and cloudinary first
database.connect();
cloudinaryConnect();

// SIMPLE CORS CONFIGURATION THAT WORKS
const allowedOrigins = [
  "http://localhost:3000",
  "https://study-notion-alpha-sooty.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Test endpoint to verify CORS is working
app.get("/api/test-cors", (req, res) => {
  res.json({ 
    success: true, 
    message: "CORS is working correctly!",
    timestamp: new Date().toISOString()
  });
});

// Import and use routes
app.use("/api/v1/auth", require("./routes/user"));
app.use("/api/v1/profile", require("./routes/profile"));
app.use("/api/v1/course", require("./routes/Course"));
app.use("/api/v1/payment", require("./routes/Payments"));
app.use("/api/v1/reach", require("./routes/Contact"));
app.use("/api/v1/upload", require("./routes/upload"));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StudyNotion Server is running...",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: 'CORS error: ' + err.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
