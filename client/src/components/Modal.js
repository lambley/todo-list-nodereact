  import React, { useState, useRef, useEffect } from "react";

const Modal = ({ socket, showModal, setShowModal, selectedId }) => {
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([])

  const modalRef = useRef()

  // close on click on div.modal
  const closeModal = (event) => {
    if (modalRef.current === event.target) {
      setShowModal(!showModal)
    }
  }

  // listen for socket event "commentsReceived"
  useEffect(() => {
    socket.on("commentsReceived", (todo) => setCommentList(todo.comments))
  }, [socket])

  const addComment = (e) => {
    e.preventDefault();
    socket.emit("updateComment", {
      todoId: selectedId,
      comment,
      username: localStorage.getItem("_username") || "anon"
    })
    setComment("");
  };

  return (
    <div className='modal' onClick={closeModal} ref={modalRef}>
      <div className='modal__container'>
        <h3>Comments</h3>
        <form className='comment__form' onSubmit={addComment}>
          <input
            className='comment__input'
            type='text'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button onClick={()=>addComment}>Add Comment</button>
        </form>
        <div className='comments__container'>
          {commentList.length > 0
            ? (commentList.map((item, index) => (
              <div className="comment" key={index}>
                <p>
                  <strong>{item.username}</strong> ({item.createdAt}) {item.comment}
                </p>
              </div>
            )))
            : (<p>No comments yet...</p>)
          }
        </div>
      </div>
    </div>
  );
};

export default Modal;
