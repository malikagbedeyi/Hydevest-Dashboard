import React, { createContext, useContext, useState } from "react";
import PopupMessage from "./PopupMessage;";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("success");


  const showMessage = (msg, msgType = "success") => {
  setMessage(msg);
  setType(msgType);

  setTimeout(() => {
    setMessage(null);
  }, 4000);
};
  const closeMessage = () => {
    setMessage(null);
  };

  return (
    <PopupContext.Provider value={{ showMessage }}>
      {children}

      <PopupMessage
        message={message}
        type={type}
        onClose={closeMessage}
      />
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);