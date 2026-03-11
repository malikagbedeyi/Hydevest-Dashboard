import { useState } from "react";

export const usePopupMessage = () => {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("success");

  const showMessage = (msg, msgType = "success") => {
    setMessage(msg);
    setType(msgType);
  };

  const closeMessage = () => {
    setMessage(null);
  };

  return {
    message,
    type,
    showMessage,
    closeMessage,
  };
};