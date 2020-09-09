import { renderCanvas } from "./renderFunction.js";

let indexed = [1, 1];

function zoom(height, width, points, scaleX, scaleY) {
  console.log(indexed);
  console.log(points);
  if (indexed[0] > indexed[1]) {
    let spliceEnd = points.splice(indexed[0]);
    let spliceStart = points.splice(0, indexed[1]);
  } else if (indexed[1] > indexed[0]) {
    let spliceEnd = points.splice(indexed[1]);
    let spliceStart = points.splice(0, indexed[0]);
  } else {
    console.log("err");
  }
  console.log(points);
  renderCanvas(height, width, points, scaleX, scaleY);
}

export function zoomDown(index) {
  console.log("mouse down: " + index);
  indexed[0] = index;
}

export function zoomUp(index, height, width, points, scaleX, scaleY) {
  console.log("mouse up: " + index);
  indexed[1] = index;
  zoom(height, width, points, scaleX, scaleY);
}
