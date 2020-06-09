import React, { createContext, useContext, useEffect, useState } from "react";

const initialStopwatchValue = {
  startStopwatch: () => {},
  stopStopwatch: () => {},
  resetStopwatch: () => {},
};

export const StopwatchContext = createContext(initialStopwatchValue);

export const StopwatchProvider = ({ children }) => {
  const [seconds, setSeconds] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);

  const startStopwatch = () => {
    if (!isStopwatchRunning) {
      setIsStopwatchRunning(true);
    }
  };

  const stopStopwatch = () => {
    setIsStopwatchRunning(false);
  };

  const resetStopwatch = () => {
    setSeconds(0);
  };

  useEffect(() => {
    let interval;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }
    if (!isStopwatchRunning) {
      clearInterval(interval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isStopwatchRunning]);

  return (
    <StopwatchContext.Provider
      value={{
        seconds,
        startStopwatch,
        stopStopwatch,
        resetStopwatch,
        isStopwatchRunning,
      }}
    >
      {children}
    </StopwatchContext.Provider>
  );
};

export const useStopwatch = () => useContext(StopwatchContext);
