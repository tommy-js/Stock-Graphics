// Entrypoint for graphics engine.
// This project will be a small graphics library, designed for the express purpose of.
// rendering stock charts and allowing for user input and interaction.

import { renderCanvas } from "./functions/renderFunction.js";
import { storeArray } from "./functions/zoom.js";

let points = [
  { x: "jan 1", y: 100 },
  { x: "jan 2", y: 0 },
  { x: "jan 3", y: 120 },
  { x: "jan 4", y: 395 },
  { x: "jan 5", y: 78 },
  { x: "jan 6", y: 353 },
  { x: "jan 7", y: 223 },
  { x: "jan 8", y: 256 },
  { x: "jan 9", y: 398 },
  { x: "jan 10", y: 353 },
  { x: "jan 11", y: 23 },
];

// Height and width set for the canvas generally. This is
// what the canvas should always scale down/up to.
const height = 300;
const width = 600;

const graphicalEffects = {
  backgroundColor: "grey",
  lineColor: "red",
  lineWidth: 5,
  boundaryWidth: 3,
  gainColor: "green",
  lossColor: "red",
};

export function calculateCanvasHeight(points) {
  // Calculates the maximum y-variable of the canvas.
  let calculatedMaxHeight = Math.max.apply(
    Math,
    points.map(function (o) {
      return o.y;
    })
  );
  return calculatedMaxHeight;
}

function calculateCanvasBase(points) {
  // Calculates the lowest point of the y-variable on the canvas.
  let calculatedMinHeight = Math.min.apply(
    Math,
    points.map(function (o) {
      return o.y;
    })
  );
  return calculatedMinHeight;
}

let canvHeight = calculateCanvasHeight(points);
let canvBase = calculateCanvasBase(points);

// Function takes the points and formats them to fit the graph height we had
// previously set.
export function reformatPoints(points, canvHeight) {
  let ratio = canvHeight / height / 1.8;
  let mockArr = [];
  for (let u = 0; u < points.length; u++) {
    let multip = parseFloat((points[u].y / ratio).toFixed(2));
    let newObj = { x: points[u].x, y: multip };
    mockArr.push(newObj);
  }
  return mockArr;
}

let modifiedPoints = reformatPoints(points, canvHeight);

storeArray(points, modifiedPoints);

renderCanvas(height, width, modifiedPoints, points, graphicalEffects);
