import { navigate } from "@reach/router";
import React from "react";
import Sketch from "../components/sketch/Sketch";

const SketchPage = () => {
  const blobUrl = localStorage.getItem("blobUrl");

  !blobUrl && navigate("/");

  return (
    <div>
      {blobUrl}
      <Sketch />
    </div>
  );
};

export default SketchPage;
