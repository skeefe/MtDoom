import React from "react";
import ReactDOM from "react-dom";

const Modal = (props: { onClose: any; children; title: string; className?: string }) => {
  const handleCloseClick = (e) => {
    console.log("closed");
    e.preventDefault();
    props.onClose();
  };

  const modalContent = (
    <div className={`modal-overlay ${props.className || ''}`}>
      <div className="modal-wrapper">
        <div className="modal">
          <div className="modal-header">
            <a href="#" onClick={handleCloseClick}>
              <span className="icon-close">&#x2715;</span>
              <h2>{props.title}</h2>
            </a>
          </div>
          <div className="modal-body">{props.children}</div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root")!
  );
};

export default Modal;
