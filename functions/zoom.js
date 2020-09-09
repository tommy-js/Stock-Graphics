import { renderCanvas } from "./renderFunction.js";

let indexed = [1, 1];

function zoom(height, width, points, scaleX, scaleY, graphicalEffects) {
  // Splices the array so that we get only the selected region
  if (indexed[0] > indexed[1]) {
    let spliceEnd = points.splice(indexed[0] + 1);
    let spliceStart = points.splice(0, indexed[1]);
  } else if (indexed[1] > indexed[0]) {
    let spliceEnd = points.splice(indexed[1] + 1);
    let spliceStart = points.splice(0, indexed[0]);
  } else {
    console.log("err");
  }
  console.log(points);
  renderCanvas(height, width, points, scaleX, scaleY, graphicalEffects);
}

export function zoomDown(index) {
  console.log("mouse down: " + index);
  indexed[0] = index;
}

export function zoomUp(
  index,
  height,
  width,
  points,
  scaleX,
  scaleY,
  graphicalEffects
) {
  console.log("mouse up: " + index);
  indexed[1] = index;
  let container = document.getElementById("container");
  // Removes any container divs that exist from the previous render
  for (let u = 0; u < points.length; u++) {
    let div = document.getElementById(`divEl${u}`);
    container.remove(div);
  }
  zoom(height, width, points, scaleX, scaleY, graphicalEffects);
}
