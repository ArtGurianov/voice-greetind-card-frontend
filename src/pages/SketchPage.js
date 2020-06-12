import { navigate } from "@reach/router";
import React from "react";
import Sketch from "../components/sketch/Sketch";

const SketchPage = () => {
  const dataUrl = localStorage.getItem("dataUrl");

  !dataUrl && navigate("/");

  return (
    <div>
      {dataUrl}
      <Sketch />
    </div>
  );
};

export default SketchPage;
