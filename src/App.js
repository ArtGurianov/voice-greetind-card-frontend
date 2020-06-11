import { Router } from "@reach/router";
import React from "react";
import "./App.css";
import { StopwatchProvider } from "./context/StopwatchContext";
import AudioPage from "./pages/AudioPage";
import SketchPage from "./pages/SketchPage";

function App() {
  return (
    <div className="App">
      <StopwatchProvider>
        <Router>
          <AudioPage path="/" />
          <SketchPage path="/sketch" />
        </Router>
      </StopwatchProvider>
    </div>
  );
}

export default App;
