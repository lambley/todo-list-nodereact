const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

const http = require("http").Server(app);
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let todoList = []

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("addTodo", (todo) => {
    todoList.unshift(todo)
    socket.emit("todos", todoList)
  })

  socket.on('disconnect', () => {
    socket.disconnect()
    console.log('🔥: A user disconnected');
  });
});

// GET todoList as JSON
app.get("/api", (req, res) => {
  res.json(todoList);
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
