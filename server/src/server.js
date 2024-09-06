const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const routes = require("./routes/index");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const DB = require("./config/db");
require("./config/passport"); // Import cấu hình passport
const cloudinary = require("cloudinary");
dotenv.config();
const app = express();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
// Thiết lập middleware session
app.use(
  session({
    secret: "thoi-trang-24h", // Thay thế bằng khóa bí mật của bạn
    resave: false, // Bắt buộc lưu lại session, ngay cả khi nó không bị thay đổi
    saveUninitialized: true, // Bắt buộc lưu session khi nó chưa được khởi tạo
    cookie: { secure: false }, // Nếu true, chỉ truyền cookie qua HTTPS
  })
);

app.use(cors());
app.use(express.json());
// Cấu hình Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Khởi tạo HTTP server và Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://suits-gentelman-web.vercel.app", // Địa chỉ frontend
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

app.use((req, res, next) => {
  req.io = io; // Gắn đối tượng io vào req để sử dụng trong các controller
  next();
});

// Connect to MongoDB
DB.connect();

// Thiết lập các route
routes(app);

// Khởi động server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
