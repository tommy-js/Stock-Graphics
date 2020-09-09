// Entrypoint for graphics engine.
// This project will be a small graphics library, designed for the express purpose of
// rendering stock charts and allowing for user input and interaction.

import { renderCanvas } from "./functions/renderFunction.js";

let points = [
  { x: 0, y: 100 },
  { x: 1, y: 0 },
  { x: 2, y: 120 },
  { x: 3, y: 395 },
  { x: 4, y: 78 },
  { x: "jan 4, 2020", y: 353 },
  { x: 6, y: 223 },
  { x: 7, y: 556 },
  { x: 8, y: 398 },
  { x: 9, y: 353 },
  { x: 10, y: 23 },
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
