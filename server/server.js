// require("dotenv").config();
// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const connectDB = require('./config/db');
// const { Server } = require('socket.io');


// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {origin: "http://localhost:5173"}
// });

// //socket.io
// require('./socket')(io);

// //middleware

// app.use(cors());
// app.use(express.json());

// //routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/rooms", require("./routes/roomRoutes"));
// app.use("/api/messages", require("./routes/messageRoutes"));


// //db & start
// connectDB();
// const PORT = process.env.PORT || 5000
// server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));


require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require('./config/db');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {origin: "*"}
});

//socket.io
require('./socket')(io);

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

//db & start
connectDB();
// Sanitize PORT to ensure it's a number
const rawPort = process.env.PORT || '5000';
const PORT = parseInt(rawPort.toString().trim().replace(/[^0-9]/g, ''), 10) || 5000;
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));