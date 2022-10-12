import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import axios from "axios";

const Main = ({ socket }) => {
    const [todo, setTodo] = useState("");
    const [todoList, setTodoList] = useState([]);

    const generateID = () => Math.random().toString(36).substring(2, 10);

    const handleAddTodo = (e) => {
      e.preventDefault();
      socket.emit("addTodo", {
        id: generateID(),
        todo,
        comments: [],
      });
      setTodo("");
    };

    // get todos from server
    const getTodos = async () => {
      const res = await axios.get('http://localhost:4000/api').catch((err) => {
        console.log("Fetch request failed: ", err);
      })

      setTodoList(res.data)
    }

    // listen for changes to socket
    useEffect(() => {
      getTodos()
      socket.on("todos", (data) => {
        setTodoList(data);
      })
    }, [socket])


    return (
      <div>
        <Nav />
        <form className='form' onSubmit={handleAddTodo}>
          <input
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              className='input'
              required
          />
          <button className='form__cta'>ADD TODO</button>
        </form>

        <div className='todo__container'>
          {todoList.map((item) => (
            <div className='todo__item' key={item.id}>
              <p>{item.todo}</p>
              <div>
                <button className='commentsBtn'>View Comments</button>

                <button className='deleteBtn'>DELETE</button>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}

export default Main;
