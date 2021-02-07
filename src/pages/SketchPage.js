import { navigate } from "@reach/router";
import React from "react";
import Sketch from "../components/sketch/Sketch";
import { dataUrl2blob } from "../utils/blob2dataUrl";

const SketchPage = () => {
  const dataUrl = localStorage.getItem("dataUrl");
  const message = localStorage.getItem("message");
  const audioFileBlob = dataUrl2blob(dataUrl);

  !dataUrl && navigate("/");

  return (
    <div>
      {message}
      <Sketch audioFile={audioFileBlob} />
    </div>
  );
};

export default SketchPage;
