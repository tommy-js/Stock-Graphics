// Entrypoint for graphics engine.
// This project will be a small graphics library, designed for the express purpose of.
// rendering stock charts and allowing for user input and interaction.

import { renderCanvas } from "./functions/renderFunction.js";
import { storeArray } from "./functions/zoom.js";

export function renderFull(points, graphicalEffects) {
  let typeOfHeight = typeof graphicalEffects.graphHeight;
  let typeOfWidth = typeof graphicalEffects.graphWidth;

  let contents = document.getElementById(graphicalEffects.contentsDiv);
  let positionContents = contents.getBoundingClientRect();
  let maxHeight = positionContents.height;
  let maxWidth = positionContents.width;

  if (typeOfHeight === "string") {
    graphicalEffects.graphHeight = maxHeight;
  } else if (typeOfHeight === "number") {
    if (graphicalEffects.graphHeight < 100) {
      graphicalEffects.graphHeight = 100;
    }
  }

  if (typeOfWidth === "string") {
    graphicalEffects.graphWidth = maxWidth;
  } else if (typeOfWidth === "number") {
    if (graphicalEffects.graphWidth < 200) {
      graphicalEffects.graphWidth = 200;
    }
  }

  function calculateCanvasHeight(points) {
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

  // Formats the points we have so that they actually fill the graph screen.

  function reformatPoints(points, canvHeight, canvBase) {
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
  console.log("range: " + range);
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
