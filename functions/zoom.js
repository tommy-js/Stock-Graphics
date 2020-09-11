import { renderCanvas } from "./renderFunction.js";

let indexed = [0, 0];

export function zoom(height, width, points, prePoints, graphicalEffects) {
  let container = document.getElementById("container");

  // Removes any container divs that exist from the previous render
  for (let u = 0; u < points.length; u++) {
    let div = document.getElementById(`divEl${u}`);
    container.remove(div);
  }

  // Checks to make sure that we haven't zoomed in already
  let indexedAccurate;
  if (indexed[0] === indexed[1]) {
    indexedAccurate = false;
  } else {
    indexedAccurate = true;
  }

  // Splices the array so that we get only the selected region
  if (indexedAccurate === true) {
    if (indexed[0] > indexed[1]) {
      prePoints.splice(indexed[0] + 1);
      prePoints.splice(0, indexed[1]);

      points.splice(indexed[0] + 1);
      points.splice(0, indexed[1]);
    } else if (indexed[1] > indexed[0]) {
      prePoints.splice(indexed[1] + 1);
      prePoints.splice(0, indexed[0]);

      points.splice(indexed[1] + 1);
      points.splice(0, indexed[0]);
    } else {
      console.log("err");
    }
  } else {
    console.log("err");
  }

  console.log(points);
  renderCanvas(height, width, prePoints, points, graphicalEffects);
  indexed = [0, 0];
}

export function zoomDown(index, calcWidth, points) {
  // Deletes any boundaries present when the mouse is clicked on the graph, thus reducing annoyance for the user.
  let boundaryDiv1 = document.getElementById("boundaryDiv1");
  let boundaryDiv2 = document.getElementById("boundaryDiv2");
  boundaryDiv1.style.display = "none";
  boundaryDiv2.style.display = "none";

  // Sets the first index to the current container div.
  console.log("mouse down: " + index);
  indexed[0] = index;
  renderZoomDown(index, calcWidth, points);
}

export function zoomUp(index, calcWidth, points) {
  // Sets the second index to the current container div.
  console.log("mouse up: " + index);
  indexed[1] = index;
  renderZoomUp(index, calcWidth, points);
}

function renderZoomDown(index, calcWidth, points) {
  // Renders out the boundary div when the mouse is first clicked.
  let boundaryDiv1 = document.getElementById("boundaryDiv1");
  let width = calcWidth * index;
  console.log("width: " + width);
  boundaryDiv1.style.left = `${width}px`;
  boundaryDiv1.style.display = "block";
}

function renderZoomUp(index, calcWidth, points) {
  // Renders out the boundary div when the mouse is released.
  if (indexed[0] != indexed[1]) {
    let boundaryDiv2 = document.getElementById("boundaryDiv2");
    let width = calcWidth * index;
    console.log("width: " + width);
    boundaryDiv2.style.left = `${width}px`;
    boundaryDiv2.style.display = "block";
  } else {
    let boundaryDiv1 = document.getElementById("boundaryDiv1");
    boundaryDiv1.style.display = "none";
  }
}
