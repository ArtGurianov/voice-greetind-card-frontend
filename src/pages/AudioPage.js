import React from "react";
import Player from "../components/audio/Player";
import Recorder from "../components/audio/Recorder";
import Uploader from "../components/audio/Uploader";
import { AudioProvider } from "../context/AudioContext";

const AudioPage = () => {
  return (
    <AudioProvider>
      <Uploader />
      OR
      <Recorder />
      <Player />
    </AudioProvider>
  );
};

export default AudioPage;
