import React from "react";
import "./Toast.css";

function Toast({ message, type, onClose }) {
  if (!message) return null;

  const toastClass =
    type === "success" ? "toast-box success" : "toast-box error";

  return (
    <div className="toast-container">
      <div className={toastClass}>
        <p className="toast-message">{message}</p>
        <button onClick={onClose} className="toast-close" aria-label="Close">
          ✖
        </button>
      </div>
    </div>
  );
}

export default Toast;
