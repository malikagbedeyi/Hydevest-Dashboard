import { useEffect, useRef } from "react";

const useAutoLogout = (logout, timeout = 300000) => {
  const timer = useRef(null);

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      logout();
    }, timeout);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);
};

export default useAutoLogout;