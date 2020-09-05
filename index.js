// Entrypoint for graphics engine.
// This project will be a small graphics library, designed for the express purpose of
// rendering stock charts and allowing for user input and interaction.

import renderCanvas from "./functions/renderFunction.js";

let points = [
  { x: 0, y: 100 },
  { x: 1, y: 0 },
  { x: 2, y: 120 },
  { x: 3, y: 295 },
  { x: 4, y: 78 },
];

function calculateCanvasHeight(points) {
  let calculatedMaxHeight = Math.max.apply(
    Math,
    points.map(function (o) {
      return o.y;
    })
  );
  let indexedHeight = calculatedMaxHeight / 2 + 20;
  return indexedHeight;
}

let canvHeight = calculateCanvasHeight(points);
let appropriateWidth = canvHeight * 2;

renderCanvas(canvHeight, appropriateWidth, points);
