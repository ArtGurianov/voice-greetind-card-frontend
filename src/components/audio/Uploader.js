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
    </div>
  );
};

export default Uploader;
