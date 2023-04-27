import React, { useEffect, useState } from "react";

export const Timer = (props) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((seconds) => seconds - 1);
      } else if (minutes > 0) {
        setMinutes((minutes) => minutes - 1);
        setSeconds(59);
      }
    }, 1000);
    if (minutes === 0 && seconds === 1) {
      props.func();
    }
    return () => clearInterval(interval);
  }, [seconds, minutes, props]);

  return (
    <div className="game timer">
      0{minutes}:{seconds > 9 ? "" : "0"}
      {seconds}
    </div>
  );
};
