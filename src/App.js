import { Router } from "@reach/router";
import React from "react";
import "./App.css";
import AudioPage from "./pages/AudioPage";
import SketchPage from "./pages/SketchPage";

function App() {
  return (
    <div className="App">
      <Router>
        <AudioPage path="/" />
        <SketchPage path="/sketch" />
      </Router>
    </div>
  );
}

export default App;
