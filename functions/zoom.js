import { renderCanvas, calculateCenterAlign } from "./renderFunction.js";
import { reformatPoints, calculateCanvasHeight } from "../index.js";

let indexed = [0, 0];
let indexedArray = [{ a: 0, b: 0 }];
let prevArray;
let modifiedPrevArray;

export function storeArray(initialArray, modifiedArray) {
  indexedArray[0].b = initialArray.length;
  console.log(indexedArray);

  prevArray = [...initialArray];
  modifiedPrevArray = [...modifiedArray];

  console.log("prevArray: ");
  console.log(prevArray);
  console.log("modifiedPrevArray:");
  console.log(modifiedPrevArray);
}

export function zoom(height, width, points, prePoints, graphicalEffects) {
  let container = document.getElementById("container");
  let scalingContainer = document.getElementById("scalingContainer");

  let pointCopy = [...prevArray];

  let prePointCopy = [...modifiedPrevArray];

  // Removes any container divs that exist from the previous render
  for (let u = 0; u < points.length; u++) {
    let div = document.getElementById(`divEl${u}`);
    container.remove(div);
  }
  for (let g = 0; g < 3; g++) {
    let info = document.getElementById(`verticalScale${g}`);
    scalingContainer.remove(info);
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
      prePointCopy.splice(indexed[0]);
      prePointCopy.splice(0, indexed[1]);

      pointCopy.splice(indexed[0]);
      pointCopy.splice(0, indexed[1]);
      let x = indexed[0];
      let y = indexed[1];
      let obj = { a: y, b: x };
      indexedArray.push(obj);
      console.log("array from zoom: ");
      console.log(indexedArray);
    } else if (indexed[1] > indexed[0]) {
      prePointCopy.splice(indexed[1]);
      prePointCopy.splice(0, indexed[0]);

      pointCopy.splice(indexed[1]);
      pointCopy.splice(0, indexed[0]);
      let x = indexed[1];
      let y = indexed[0];
      let obj = { a: y, b: x };
      indexedArray.push(obj);
      console.log("array from zoom: ");
      console.log(indexedArray);
    } else {
      console.log("err");
    }
  } else {
    console.log("err");
  }

  // Runs the height reformatting again so that we can set the zoom to fill the proper amount of screen.
  let cHeight = calculateCanvasHeight(pointCopy);
  let refPoints = reformatPoints(pointCopy, cHeight);
  renderCanvas(height, width, refPoints, pointCopy, graphicalEffects);
  indexed = [0, 0];
}

export function zoomDown(
  index,
  calcWidth,
  points,
  left,
  dpi,
  graphicalEffects
) {
  // Deletes any boundaries present when the mouse is clicked on the graph, thus reducing annoyance for the user.
  let boundaryDiv1 = document.getElementById("boundaryDiv1");
  let boundaryDiv2 = document.getElementById("boundaryDiv2");
  boundaryDiv1.style.display = "none";
  boundaryDiv2.style.display = "none";

  // Sets the first index to the current container div.
  indexed[0] = index;
  renderZoomDown(index, calcWidth, points, left, dpi, graphicalEffects);
}

function renderZoomDown(index, calcWidth, points, left, dpi, graphicalEffects) {
  // Renders out the boundary div when the mouse is first clicked.

  let boundaryDiv1 = document.getElementById("boundaryDiv1");
  let width = calcWidth * index;

  // Calculates the center value of the container div so that the boundary will appear at the highest value.
  let centered = calculateCenterAlign(
    calcWidth,
    width,
    graphicalEffects.boundaryWidth,
    1
  );
  boundaryDiv1.style.left = `${centered}px`;
  boundaryDiv1.style.display = "block";
}

export function zoomUp(index, calcWidth, points, left, dpi, graphicalEffects) {
  // Sets the second index to the current container div.
  indexed[1] = index;
  renderZoomUp(index, calcWidth, points, left, dpi, graphicalEffects);
}

function renderZoomUp(index, calcWidth, points, left, dpi, graphicalEffects) {
  // Renders out the boundary div when the mouse is released.

  if (indexed[0] != indexed[1]) {
    let boundaryDiv2 = document.getElementById("boundaryDiv2");
    let width = calcWidth * index;

    // Calculates the center value of the container div so that the boundary will appear at the highest value.
    let centered = calculateCenterAlign(
      calcWidth,
      width,
      graphicalEffects.boundaryWidth,
      1
    );

    boundaryDiv2.style.left = `${centered}px`;
    boundaryDiv2.style.display = "block";

    // Everything below handles the positive/negative result when you drag the boundary div.
    let sub;
    let ind1 = indexed[0];
    let ind2 = indexed[1];
    if (ind1 > ind2) {
      sub = points[ind1].y - points[ind2].y;
    } else if (ind2 > ind1) {
      sub = points[ind2].y - points[ind1].y;
    }

    let boundaryDiv1 = document.getElementById("boundaryDiv1");
    if (sub < 0) {
      boundaryDiv1.style.backgroundColor = `${graphicalEffects.lossColor}`;
      boundaryDiv2.style.backgroundColor = `${graphicalEffects.lossColor}`;
    } else if (sub >= 0) {
      boundaryDiv1.style.backgroundColor = `${graphicalEffects.gainColor}`;
      boundaryDiv2.style.backgroundColor = `${graphicalEffects.gainColor}`;
    }
  } else {
    // Handles the situation when the user clicks on the same div twice.
    let boundaryDiv1 = document.getElementById("boundaryDiv1");
    boundaryDiv1.style.display = "none";
  }
}

export function zoomOut(height, width, graphicalEffects) {
  let indexedLength = indexedArray.length;
  if (indexedLength > 0) {
    let modArr = [...modifiedPrevArray];
    let prevArr = [...prevArray];
    let prevObj;
    if (indexedLength > 1) {
      prevObj = indexedArray[indexedLength - 2];
    } else if (indexedLength === 1) {
      prevObj = indexedArray[0];
    }
    console.log("prev obj: ");
    console.log(prevObj);
    modArr.splice(0, prevObj.a);
    modArr.splice(prevObj.b);
    prevArr.splice(0, prevObj.a);
    prevArr.splice(prevObj.b);
    indexedArray.splice(indexedLength - 1);
    console.log(indexedArray);
    console.log(prevArray);
    console.log(modifiedPrevArray);

    let container = document.getElementById("container");
    let scalingContainer = document.getElementById("scalingContainer");

    // Removes any container divs that exist from the previous render
    for (let u = 0; u < prevArray.length; u++) {
      let div = document.getElementById(`divEl${u}`);
      container.remove(div);
    }
    for (let g = 0; g < 3; g++) {
      let info = document.getElementById(`verticalScale${g}`);
      scalingContainer.remove(info);
    }

    renderCanvas(height, width, modArr, prevArr, graphicalEffects);
  }
}
