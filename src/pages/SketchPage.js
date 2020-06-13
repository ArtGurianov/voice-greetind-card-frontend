import { navigate } from "@reach/router";
import React from "react";
import Sketch from "../components/sketch/Sketch";

const SketchPage = () => {
  const dataUrl = localStorage.getItem("dataUrl");
  const message = localStorage.getItem("message");

  !dataUrl && navigate("/");

  return (
    <div>
      {message}
      <Sketch />
    </div>
  );
};

export default SketchPage;
