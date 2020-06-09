import React from "react";
import "./App.css";
import Audio2 from "./Audio2";
import { StopwatchProvider } from "./context/StopwatchContext";
import Sketch from "./Sketch";

function App() {
  return (
    <div className="App">
      <Sketch />
      <StopwatchProvider>
        <Audio2 />
      </StopwatchProvider>
    </div>
  );
}

export default App;
