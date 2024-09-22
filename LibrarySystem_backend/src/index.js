const express = require('express');
const connectDB = require('./database/db');
const app = express();
const recommendRoute = require('./routes/recommend.route');
const borrowRoute = require('./routes/borrow.route');
const authRoute = require('./routes/auth.route');
const bookRoute = require('./routes/book.route');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// CORS configuration
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log JWT_SECRET (make sure not to expose this in production)
const JWT_SECRET = 'your_secret_key_here'; // Ghi trực tiếp nếu không dùng biến môi trường
console.log('JWT_SECRET:', JWT_SECRET);

app.use(express.json());
const PORT = 5000; // Có thể thay đổi cổng nếu cần

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// API routes
app.use("/api/v1", bookRoute);
app.use("/api/v1", authRoute);
app.use('/api/v1', borrowRoute);
app.use('/api/v1', recommendRoute);

// Connect to the database
connectDB();

// Start the server
app.listen(PORT, () => console.log(`Server started on port: http://localhost:${PORT}`));
