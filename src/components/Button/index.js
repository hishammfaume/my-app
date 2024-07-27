import React from "react";
import "./styles.css";

function Button({ text, onClick, orange, disabled }) {
  return (
    <div
      className={orange ? "btn btn-orange" : "btn"}
      onClick={!disabled ? onClick : null} // Only trigger onClick if not disabled
      style={{ cursor: disabled ? "not-allowed" : "pointer" }} // Show pointer cursor only if not disabled
    >
      {text}
    </div>
  );
}

export default Button;

