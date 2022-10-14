  import React, { useState, useRef } from "react";

const Modal = ({ socket, showModal, setShowModal }) => {
  const [comment, setComment] = useState("");

  const modalRef = useRef()

  // close on click on div.modal
  const closeModal = (event) => {
    if (modalRef.current === event.target) {
      setShowModal(!showModal)
    }
  }

  const addComment = (e) => {
    e.preventDefault();
    console.log({ comment });
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
          <button>Add Comment</button>
        </form>
        <div className='comments__container'>
          <div className='comment'>
            <p>
                Example comment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
