// Entrypoint for graphics engine.
// This project will be a small graphics library, designed for the express purpose of.
// rendering stock charts and allowing for user input and interaction.

import { renderCanvas } from "./functions/renderFunction.js";
import { storeArray } from "./functions/zoom.js";

let points = [
  { x: "Jul 01, 2020", y: 91.28 },
  { x: "Jul 02, 2020", y: 91.96 },
  { x: "Jul 06, 2020", y: 92.5 },
  { x: "Jul 07, 2020", y: 93.85 },
  { x: "Jul 08, 2020", y: 94.18 },
  { x: "Jul 09, 2020", y: 96.26 },
  { x: "Jul 10, 2020", y: 95.33 },
  { x: "Jul 13, 2020", y: 97.26 },
  { x: "Jul 14, 2020", y: 94.84 },
  { x: "Jul 15, 2020", y: 98.99 },
  { x: "Jul 16, 2020", y: 96.56 },
  { x: "Jul 09, 2020", y: 96.26 },
  { x: "Jul 17, 2020", y: 96.99 },
  { x: "Jul 20, 2020", y: 96.42 },
  { x: "Jul 14, 2020", y: 94.84 },
  { x: "Jul 15, 2020", y: 98.99 },
  { x: "Jul 16, 2020", y: 96.56 },
  { x: "Jul 14, 2020", y: 94.84 },
  { x: "Jul 15, 2020", y: 98.99 },
  { x: "Jul 16, 2020", y: 96.56 },
  { x: "Jul 09, 2020", y: 96.26 },
  { x: "Jul 17, 2020", y: 96.99 },
  { x: "Jul 20, 2020", y: 96.42 },
  { x: "Jul 14, 2020", y: 94.84 },
  { x: "Jul 15, 2020", y: 98.99 },
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

// Function takes the points and formats them to fit the graph height we had
// previously set.
// export function reformatPoints(points, canvHeight, canvBase) {
//   let ratio = canvHeight / height / 1.8;
//   let mockArr = [];
//   for (let u = 0; u < points.length; u++) {
//     let multip = parseFloat((points[u].y / ratio - canvBase).toFixed(2));
//     let newObj = { x: points[u].x, y: multip };
//     mockArr.push(newObj);
//   }
//   return mockArr;
// }

// let modifiedPoints = reformatPoints(points, canvHeight, canvBase);

// Average all the y-points and then scale each point proportionately to how far it is from that center line.
// Calculate the y-value / max height and then multiply distance by this

export function reformatPoints(points, canvHeight, canvBase) {
  let pointsCopy = [];
  let avg = 0;
  let absoluteMax = height + (1 / 4) * height;
  let ratioDistance = absoluteMax * 2;
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
    let mult = distance * 5 * scaleFactor + finalizedAvg + canvBase;
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
