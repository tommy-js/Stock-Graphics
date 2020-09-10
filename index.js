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

const graphicalEffects = {
  backgroundColor: "teal",
  lineColor: "red",
  lineWidth: 5,
};

function calculateCanvasHeight(points) {
  // Calculates the maximum y-variable of the canvas
  let calculatedMaxHeight = Math.max.apply(
    Math,
    points.map(function (o) {
      return o.y;
    })
  );
  // let indexedHeight = calculatedMaxHeight / 2 + 20;
  let indexedHeight = height - 20;
  return { indexed: indexedHeight, calculated: calculatedMaxHeight };
}

function calculateCanvasBase(points) {
  // Calculates the lowest point of the y-variable on the canvas
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

// highest point / height of graph = ratio
// each point / ratio

// Function takes the points and formats them to fit the graph height we had
// previously set
function reformatPoints(points, canvHeight, canvBase) {
  let rat = canvHeight / height;
  let mockArr = [];
  for (let u = 0; u < points.length; u++) {
    let multip = points[u].y / rat;
    let newObj = { x: points[u].x, y: multip };
    mockArr.push(newObj);
  }
  console.log("mock array: ");
  console.log(mockArr);
  return mockArr;
}

let appropriateWidth = canvHeight.indexed * 2;

let modifiedPoints = reformatPoints(points, canvHeight.calculated, canvBase);

renderCanvas(
  canvHeight.indexed,
  appropriateWidth,
  modifiedPoints,
  graphicalEffects
);
