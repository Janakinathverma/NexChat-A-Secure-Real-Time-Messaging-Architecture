const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.log("DB Error:", err.message));

// ✅ Routes
app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ FIX: fallback + explicit port handling
const PORT = process.env.PORT || 5000;

// ✅ Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

// 🔥 CRITICAL: handle port-in-use error cleanly
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log("👉 Try a different port or kill the running process");
  } else {
    console.error("Server error:", err);
  }
});

// ✅ Socket setup
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// ✅ Use local variable instead of global (cleaner)
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("⚡ New socket connected:", socket.id);

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});