// Entrypoint for graphics engine.
// This project will be a small graphics library, designed for the express purpose of.
// rendering stock charts and allowing for user input and interaction.

import { renderCanvas } from "./functions/renderFunction.js";
import { storeArray } from "./functions/zoom.js";

let points = [
  { x: "07/01", y: 2 },
  { x: "07/02", y: 2 },
  { x: "07/06", y: 2 },
  { x: "07/07", y: 2 },
  { x: "07/02", y: 2 },
  { x: "07/06", y: 1 },
  { x: "07/07", y: 3 },
  { x: "07/02", y: 4 },
  { x: "07/06", y: 2 },
  { x: "07/07", y: 3 },
];

const graphicalEffects = {
  graphHeight: 300,
  graphWidth: 600,
  title: "Apple",
  ticker: "AAPL",
  fontSize: 22,
  backgroundColor: "white",
  lineColor: "red",
  lineWidth: 5,
  boundaryWidth: 3,
  gainColor: "green",
  lossColor: "red",
  fillColor: "red",
  dateRangeActive: false,
  graphFontSize: 16,
  infoDivWidth: 100,
};

if (graphicalEffects.graphHeight < 300) {
  graphicalEffects.graphHeight = 300;
}
if (graphicalEffects.graphWidth < 600) {
  graphicalEffects.graphWidth = 600;
}

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
  let range = canvHeight - canvBase;
  console.log("range: " + range);
  let height = graphicalEffects.graphHeight;
  let scaledHeight = height * 0.75;
  let scale = scaledHeight / range;

  let distance = canvBase * scale;
  console.log("distance: " + distance);

  let pointsCopy = [];
  for (let t = 0; t < points.length; t++) {
    let mult = points[t].y * scale - distance;
    let newObj = { x: points[t].x, y: mult };
    pointsCopy.push(newObj);
  }
  console.log("scaled array: ");
  console.log(pointsCopy);
  return pointsCopy;
}

let modifiedPoints = reformatPoints(points, canvHeight, canvBase);

storeArray(points, modifiedPoints);

renderCanvas(
  graphicalEffects.graphHeight,
  graphicalEffects.graphWidth,
  modifiedPoints,
  points,
  graphicalEffects
);
