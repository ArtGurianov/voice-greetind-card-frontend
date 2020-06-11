import React, { useEffect, useRef } from "react";
import { useAudio } from "../../context/AudioContext";

const Uploader = () => {
  const { blobUrl, uploadAudio, refs, setRefs } = useAudio();
  const uploaderRef = useRef();
  const uploaderResetButtonRef = useRef();

  useEffect(() => {
    setRefs((prevRefs) => {
      return { ...prevRefs, uploaderRef, uploaderResetButtonRef };
    });
  }, [setRefs]);

  return (
    <div>
      <div style={blobUrl ? { display: "none" } : { display: "inline-table" }}>
        <input
          onClick={() => uploadAudio(refs)}
          type="file"
          accept="audio/*"
          capture
          ref={uploaderRef}
        />
      </div>
      <div style={!blobUrl ? { display: "none" } : { display: "inline-table" }}>
        <button ref={uploaderResetButtonRef}>X</button>
      </div>
    </div>
  );
};

export default Uploader;
