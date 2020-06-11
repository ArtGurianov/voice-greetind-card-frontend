import React, { useEffect, useRef } from "react";
import { useAudio } from "../../context/AudioContext";

const Actions = () => {
  const { blobUrl, setRefs } = useAudio();
  const downloadLinkRef = useRef();
  const resetButtonRef = useRef();

  useEffect(() => {
    setRefs((prevRefs) => {
      return {
        ...prevRefs,
        downloadLinkRef,
        resetButtonRef,
      };
    });
  }, [setRefs]);
  return (
    <div>
      <div style={!blobUrl ? { display: "none" } : { display: "inline-table" }}>
        <button ref={resetButtonRef}>X</button>
      </div>
      <div style={blobUrl ? { display: "inline-table" } : { display: "none" }}>
        <a
          href={blobUrl ? blobUrl : "/"}
          ref={downloadLinkRef}
          download="myrecord.wav"
        >
          download
        </a>
      </div>
    </div>
  );
};

export default Actions;
