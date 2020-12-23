// Entrypoint for graphics engine.
// This project will be a small graphics library, designed for the express purpose of
// rendering stock charts and allowing for user input and interaction.

import { renderCanvas } from "./functions/renderFunction.mjs";

export function renderFull(graphicalEffects) {
  let typeOfHeight = typeof graphicalEffects.graphHeight;
  let typeOfWidth = typeof graphicalEffects.graphWidth;

  graphicalEffects.indexedArray[0].b = graphicalEffects.initialValues.length;

  let contents = document.getElementById(graphicalEffects.contentsDiv);
  let positionContents = contents.getBoundingClientRect();
  let maxHeight = positionContents.height;
  let maxWidth = positionContents.width;

  if (typeOfHeight === "string") {
    graphicalEffects.graphHeight = maxHeight - 85;
  } else if (typeOfHeight === "number") {
    if (graphicalEffects.graphHeight < 100) {
      graphicalEffects.graphHeight = 100;
    }
  }

  if (typeOfWidth === "string") {
    graphicalEffects.graphWidth = maxWidth - 100;
  } else if (typeOfWidth === "number") {
    if (graphicalEffects.graphWidth < 200) {
      graphicalEffects.graphWidth = 200;
    }
  }

  let canvHeight = calculateCanvasHeight(graphicalEffects.modifiedPoints);
  let canvBase = calculateCanvasBase(graphicalEffects.modifiedPoints);

  let modifiedPoints = reformatPoints(
    graphicalEffects.modifiedPoints,
    canvHeight,
    canvBase,
    graphicalEffects.graphHeight
  );

  graphicalEffects.modifiedPoints = modifiedPoints;

  renderCanvas(
    graphicalEffects.graphHeight,
    graphicalEffects.graphWidth,
    graphicalEffects.modifiedPoints,
    graphicalEffects.initialValues,
    graphicalEffects
  );
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

export function reformatPoints(points, canvHeight, canvBase, height) {
  let range = canvHeight - canvBase;
  let scaledHeight = height * 0.75;
  let scale = scaledHeight / range;

  let distance = canvBase * scale;

  let pointsCopy = [];
  for (let t = 0; t < points.length; t++) {
    let mult = points[t].y * scale - distance;
    let newObj = { x: points[t].x, y: mult };
    pointsCopy.push(newObj);
  }
  return pointsCopy;
}
