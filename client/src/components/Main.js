import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Modal from "./Modal";
import axios from "axios";

const Main = ({ socket }) => {
    const [todo, setTodo] = useState("");
    const [todoList, setTodoList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState("");

    const toggleModal = (todoId) => {
      // request comments for todoId
      socket.emit("viewComments", todoId)
      setSelectedId(todoId)
      setShowModal(!showModal)
    }

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

    const deleteTodo = (id) => {
      socket.emit('deleteTodo', id)
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
                <button
                  className='commentsBtn'
                  onClick={() => toggleModal(item.id)}
                >
                  View Comments
                </button>

                <button
                  className='deleteBtn'
                  onClick={() => deleteTodo(item.id)}
                >
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
        {showModal
          ? (<Modal
              showModal={showModal}
              setShowModal={setShowModal}
              socket={socket}
              selectedId={selectedId}
            />)
          : ("")
        }
      </div>
  );
}

export default Main;
