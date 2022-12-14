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

// todo object:
// {
//    id: "1234abcd"
//    todo: "todo conten as string"
//    comments: []
// }

// comment object:
// {
//   comment: "comment string"
//   username: "username string"
//   createdAt: Date
// }

let todoList = []

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  // listen for new todo item and add to list
  socket.on("addTodo", (todo) => {
    todoList.unshift(todo)
    socket.emit("todos", todoList)
  })

  // listen for delete todo action and delete from list
  socket.on('deleteTodo', (id => {
    todoList = todoList.filter((todo) => todo.id !== id)
    // send updated list to client
    socket.emit("todos", todoList);
  }))

  // listen for comment request for specific todo
  socket.on("viewComments", (id) => {
    for (let i = 0; i < todoList.length; i++) {
      if (todoList[i].id === id) {
        socket.emit("commentsReceived", todoList[i])
      }
    }
  })

  // listen for add comment event
	socket.on("updateComment", (data) => {
		const { username, todoId, comment } = data;

    // find todo and add comment to comment array
		for (let i = 0; i < todoList.length; i++) {
			if (todoId === todoList[i].id) {
        const createdAt = new Date().toLocaleString()
				todoList[i].comments.push({
          username,
          comment,
          createdAt
        });
				socket.emit("commentsReceived", todoList[i]);
        console.log(todoList[i]);
			}
		}
	});

  // console message on disconnect
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
