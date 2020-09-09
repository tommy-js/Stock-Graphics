// Entrypoint for graphics engine.
// This project will be a small graphics library, designed for the express purpose of
// rendering stock charts and allowing for user input and interaction.

import { renderCanvas } from "./functions/renderFunction.js";

let points = [
  { x: "jan 1", y: 100 },
  { x: "jan 2", y: 0 },
  { x: "jan 3", y: 120 },
  { x: "jan 4", y: 395 },
  { x: "jan 5", y: 78 },
  { x: "jan 6", y: 353 },
  { x: "jan 7", y: 223 },
  { x: "jan 8", y: 556 },
  { x: "jan 9", y: 398 },
  { x: "jan 10", y: 353 },
  { x: "jan 11", y: 23 },
];

// Height and width set for the canvas generally. This is
// what the canvas should always scale down/up to
const height = 300;
const width = 150;

function calculateCanvasHeight(points) {
  // Calculates the maximum y-variable of the canvas
  let calculatedMaxHeight = Math.max.apply(
    Math,
    points.map(function (o) {
      return o.y;
    })
  );
  let indexedHeight = calculatedMaxHeight / 2 + 20;
  return { indexed: indexedHeight, calculated: calculatedMaxHeight };
}

let canvHeight = calculateCanvasHeight(points);
let appropriateWidth = canvHeight.indexed * 2;

let scaleX = canvHeight.calculated / width;
let scaleY = canvHeight.calculated / height;
console.log("scaleX: " + scaleX);
console.log("scaleY: " + scaleY);

renderCanvas(canvHeight.indexed, appropriateWidth, points, scaleX, scaleY);
