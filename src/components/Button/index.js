import React from "react";
import "./styles.css";
function Button({ text, onClick, orange, disabled }) {
  return (
    <div
      className={orange ? "btn btn-orange" : "btn"}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </div>
  );
}

export default Button;
