import p5 from "p5";
import "p5/lib/addons/p5.dom";
import "p5/lib/addons/p5.sound";
import React from "react";
//import "./scripts/p5.sound";

const createSketch = (p) => {
  // Native p5 functions work as they would normally but prefixed with
  // a p5 object "p"
  p.setup = () => {
    //Everyhting that normally happens in setup works
    p.createCanvas(800, 200);
  };

  p.draw = () => {
    // And everything that normally goes in draw in here
    p.background(0);
    p.circle(p.width / 3, p.height / 2, 50);
    //p.triangle(30, 75, 58, 20, 86, 75);
  };
};

const Sketch = () => {
  const myRef = React.createRef();
  new p5(createSketch, myRef.current);

  return <div ref={myRef}></div>;
};

export default Sketch;
