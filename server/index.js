const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");
const uploadRoutes = require("./routes/upload"); 
const fs = require("fs");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const dotenv = require("dotenv");
// Loading environment variables from .env file
dotenv.config();
// Setting up port number
const PORT = process.env.PORT || 4000;
// Connecting to database
database.connect();
// Middlewares

app.use(express.json({ limit: '10mb'}));
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:3000", "https://study-notion-alpha-sooty.vercel.app"],
  credentials: true
};
app.use(cors(corsOptions));
// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/upload", uploadRoutes); 
// Testing the server
app.get("/", (req, res) => {
	res.send("Server is running");
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});
// Memory monitoring
setInterval(() => {
  const memory = process.memoryUsage();
  console.log(`Memory - RSS: ${Math.round(memory.rss / 1024 / 1024)}MB`);
}, 30000);

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

