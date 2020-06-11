import React, { useEffect, useRef } from "react";
import { useAudio } from "../../context/AudioContext";

const Uploader = () => {
  const { blobUrl, uploadAudio, refs, setRefs } = useAudio();
  const uploaderRef = useRef();

  useEffect(() => {
    setRefs((prevRefs) => {
      return { ...prevRefs, uploaderRef };
    });
  }, [setRefs]);

  return (
    <div style={blobUrl ? { display: "none" } : { display: "block" }}>
      <input
        onClick={() => uploadAudio(refs)}
        type="file"
        accept="audio/*"
        capture
        ref={uploaderRef}
      />
    </div>
  );
};

export default Uploader;
