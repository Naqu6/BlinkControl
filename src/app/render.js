import cv from "../build/Release/blinkDetector";
import App from "../app/app";

import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


// cv.startProcessing((left, right) => {
// 	console.log(left, right);

// 	document.querySelector()
// });