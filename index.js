// Entrypoint for graphics engine.
// This project will be a small graphics library, designed for the express purpose of.
// rendering stock charts and allowing for user input and interaction.

import { renderCanvas } from "./functions/renderFunction.js";
import { storeArray } from "./functions/zoom.js";

let points = [
  { x: "Jul 01", y: 91.28 },
  { x: "Jul 02", y: 91.96 },
  { x: "Jul 06", y: 92.5 },
  { x: "Jul 07", y: 93.85 },
  { x: "Jul 08", y: 94.18 },
  { x: "Jul 09", y: 96.26 },
  { x: "Jul 10", y: 95.33 },
  { x: "Jul 13", y: 97.26 },
  { x: "Jul 14", y: 94.84 },
  { x: "Jul 15", y: 98.99 },
  { x: "Jul 16", y: 96.56 },
  { x: "Jul 09", y: 96.26 },
  { x: "Jul 17", y: 96.99 },
  { x: "Jul 20", y: 96.42 },
  { x: "Jul 14", y: 94.84 },
  { x: "Jul 15", y: 98.99 },
  { x: "Jul 16", y: 96.56 },
  { x: "Jul 14", y: 94.84 },
  { x: "Jul 15", y: 98.99 },
  { x: "Jul 16", y: 96.56 },
  { x: "Jul 09", y: 96.26 },
  { x: "Jul 17", y: 96.99 },
  { x: "Jul 20", y: 96.42 },
  { x: "Jul 14", y: 94.84 },
  { x: "Jul 15", y: 98.99 },
];

// Height and width set for the canvas generally. This is
// what the canvas should always scale down/up to.
const height = 300;
const width = 600;

const graphicalEffects = {
  title: "Apple",
  ticker: "AAPL",
  fontSize: 22,
  backgroundColor: "grey",
  lineColor: "red",
  lineWidth: 5,
  boundaryWidth: 3,
  gainColor: "green",
  lossColor: "red",
  fillColor: "red",
  dateRangeActive: true,
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

export function calculateCanvasBase(points) {
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

// Formats the points we have so that they actually fill the graph screen.

export function reformatPoints(points, canvHeight, canvBase) {
  let pointsCopy = [];
  let avg = 0;
  let absoluteMax = height + (1 / 4) * height;
  let ratioDistance = absoluteMax * 10;
  for (let g = 0; g < points.length; g++) {
    avg = avg + points[g].y;
    console.log("avg: " + avg);
  }
  let finalizedAvg = avg / points.length;
  console.log("finalizedAvg: " + finalizedAvg);
  let scaleFactor = ratioDistance / finalizedAvg;
  console.log("scaleFactor: " + scaleFactor);
  for (let t = 0; t < points.length; t++) {
    let distance = points[t].y - finalizedAvg;
    let mult = distance * scaleFactor + finalizedAvg + canvBase;
    let newObj = { x: points[t].x, y: mult };
    pointsCopy.push(newObj);
  }
  console.log("scaled array: ");
  console.log(pointsCopy);
  return pointsCopy;
}

let modifiedPoints = reformatPoints(points, canvHeight, canvBase);

storeArray(points, modifiedPoints);

renderCanvas(height, width, modifiedPoints, points, graphicalEffects);
