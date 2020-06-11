import { navigate } from "@reach/router";
import React, { useEffect, useRef } from "react";
import { useAudio } from "../../context/AudioContext";

const Actions = () => {
  const { blobUrl, setRefs } = useAudio();
  const downloadLinkRef = useRef();
  const resetButtonRef = useRef();

  const submitAudio = () => {
    navigate("/sketch");
  };

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
    <div style={blobUrl ? { display: "block" } : { display: "none" }}>
      <div>
        <button ref={resetButtonRef}>X</button>
      </div>
      <div>
        <a
          href={blobUrl ? blobUrl : "/"}
          ref={downloadLinkRef}
          download="myrecord.wav"
        >
          download
        </a>
      </div>
      <div>
        <button onClick={submitAudio}>Next</button>
      </div>
    </div>
  );
};

export default Actions;
