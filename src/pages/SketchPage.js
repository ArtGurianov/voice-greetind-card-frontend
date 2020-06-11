import React from "react";

const SketchPage = () => {
  const blobUrl = localStorage.getItem("blobUrl");
  return <div>{blobUrl ? blobUrl : "eww :("}</div>;
};

export default SketchPage;
