import React, { useState, useEffect } from "react";
import Nav from "./Nav";

const Main = ({ socket }) => {
    const [todo, setTodo] = useState("");
    const [todoList, setTodoList] = useState([]);

    // listen for changes to socket
    useEffect(() => {
      socket.on("todos", (data) => {
        setTodoList(data);
      })
    }, [socket])

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
          <div className='todo__item'>
            <p>Contributing to open-source</p>
            <div>
              <button className='commentsBtn'>View Comments</button>
              <button className='deleteBtn'>DELETE</button>
            </div>
          </div>

          <div className='todo__item'>
            <p>Coffee chat with the team</p>
            <div>
              <button className='commentsBtn'>View Comments</button>
              <button className='deleteBtn'>DELETE</button>
            </div>
          </div>

          <div className='todo__item'>
            <p>Work on my side projects</p>
            <div>
              <button className='commentsBtn'>View Comments</button>
              <button className='deleteBtn'>DELETE</button>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Main;
