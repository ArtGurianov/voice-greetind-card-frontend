import React, { useEffect, useRef } from "react";
import { useAudio } from "../../context/AudioContext";

const Player = () => {
  const { blobUrl, setRefs } = useAudio();
  const audioPlayerRef = useRef();
  //const [duration, setDuration] = useState(null);

  useEffect(() => {
    setRefs((prevRefs) => {
      return { ...prevRefs, audioPlayerRef };
    });
  }, [setRefs]);

  useEffect(() => {
    if (blobUrl) {
      audioPlayerRef.current.load();
      audioPlayerRef.current.play();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(audioPlayerRef.current);
      const analyser = audioCtx.createAnalyser();
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const frequencyData = new Uint8Array(bufferLength);
      const interval = setInterval(() => {
        analyser.getByteFrequencyData(frequencyData);
        console.log(frequencyData);
      }, 100);
      //setTimeout(clearInterval(interval), audioPlayerRef.current.duration);
      setTimeout(() => {
        clearInterval(interval);
      }, 10000);
    }
  }, [blobUrl]);

  return (
    <div style={!blobUrl ? { display: "none" } : { display: "block" }}>
      <audio
        controls
        ref={audioPlayerRef}
        src={blobUrl}
        //onLoadedMetadata={(e) => setDuration(e.target.duration)}
      ></audio>
    </div>
  );
};

export default Player;
