import React, { useState } from "react";
import "./loginScreen.css"; // Add CSS for styling

const PasswordScreen = (props) => {
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);

  const correctPassword = "147369"; // Replace with your desired password

  const handleInput = (value) => {
    if (password.length < 6) {
      const newPassword = password + value;
      setPassword(newPassword);

      // Check if the password is complete
      if (newPassword.length === 6) {
        if (newPassword === correctPassword) {
        //   alert("Access Granted!"); // Replace with actual logic
          props.setLogin(true)
          setPassword("");
        } else {
          setIsError(true);
          setTimeout(() => {
            setIsError(false);
            setPassword("");
          }, 800); // Reset after the shake animation
        }
      }
    }
  };

  const handleDelete = () => {
    setPassword(password.slice(0, -1));
  };

  return (
    <div className="password-screen">
      <h2>Enter Password</h2>
      <div className={`dots ${isError ? "error" : ""}`}>
        {Array(6)
          .fill("")
          .map((_, index) => (
            <div
              key={index}
              className={`dot ${index < password.length ? "filled" : ""}`}
            ></div>
          ))}
      </div>
      <div className="keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
          <button
            key={number}
            className="key"
            onClick={() => handleInput(number)}
          >
            {number}
          </button>
        ))}
        <button className="key delete" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default PasswordScreen;
