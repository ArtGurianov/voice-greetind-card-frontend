import React, { useEffect, useRef } from "react";

const Sketch = ({ audioFileBlob }) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const audio = new Audio(audioFileBlob);
  const source = audioCtx.createMediaElementSource(audio);
  const analyser = audioCtx.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const frequencyData = new Uint8Array(bufferLength);

  // setInterval(() => {
  //   analyser.getByteFrequencyData(frequencyData);
  //   console.log(frequencyData);
  // }, 1000);

  //canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  // function draw() {
  //   drawVisual = requestAnimationFrame(draw);

  //   analyser.getByteFrequencyData(dataArray);

  //   canvasCtx.fillStyle = "rgb(0, 0, 0)";
  //   canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  //   var barWidth = (WIDTH / bufferLength) * 2.5;
  //   var barHeight;
  //   var x = 0;

  //   for (var i = 0; i < bufferLength; i++) {
  //     barHeight = dataArray[i];

  //     canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
  //     canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

  //     x += barWidth + 1;
  //   }
  // }

  const sketchRef = useRef();
  useEffect(() => {
    console.log(frequencyData);
  }, [frequencyData]);

  return (
    <div>
      <canvas ref={sketchRef} width="500" height="200"></canvas>
    </div>
  );
};

export default Sketch;
