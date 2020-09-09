let indexed = [1, 1];

function zoom(begin, terminate) {
  console.log(indexed);
}

export function zoomDown(index) {
  console.log("mouse down: " + index);
  indexed[0] = index;
}

export function zoomUp(index) {
  console.log("mouse up: " + index);
  indexed[1] = index;
  zoom();
}
