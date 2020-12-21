import { renderCanvas } from "./renderFunction.js";
import {
  reformatPoints,
  calculateCanvasHeight,
  calculateCanvasBase,
} from "../index.js";

let indexed = [0, 0];
let indexedArray = [{ a: 0, b: 0 }];
let prevArray;
let modifiedPrevArray;

export function storeArray(initialArray, modifiedArray) {
  indexedArray[0].b = initialArray.length;

  prevArray = [...initialArray];
  modifiedPrevArray = [...modifiedArray];
}

export function zoom(height, width, points, prePoints, graphicalEffects) {
  let contents = document.getElementById(graphicalEffects.contentsDiv);

  let container = contents.getElementsByClassName(
    `container${graphicalEffects.x_hash}`
  );
  let scalingContainer = contents.getElementsByClassName(
    `scalingContainer${graphicalEffects.x_hash}`
  );

  let pointCopy = [...prevArray];

  let prePointCopy = [...modifiedPrevArray];

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
    } else if (indexed[1] > indexed[0]) {
      prePointCopy.splice(indexed[1]);
      prePointCopy.splice(0, indexed[0]);

      pointCopy.splice(indexed[1]);
      pointCopy.splice(0, indexed[0]);
      let x = indexed[1];
      let y = indexed[0];
      let obj = { a: y, b: x };
      indexedArray.push(obj);
    } else {
      console.log("err");
    }
  } else {
    console.log("err");
  }

  // Runs the height reformatting again so that we can set the zoom to fill the proper amount of screen.
  let cHeight = calculateCanvasHeight(pointCopy);
  let cBase = calculateCanvasBase(pointCopy);
  let refPoints = reformatPoints(
    pointCopy,
    cHeight,
    cBase,
    graphicalEffects.graphHeight
  );
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
  let contents = document.getElementById(graphicalEffects.contentsDiv);
  // Deletes any boundaries present when the mouse is clicked on the graph, thus reducing annoyance for the user.
  let boundaryDiv1 = contents.getElementsByClassName(
    `boundaryDiv1${graphicalEffects.x_hash}`
  );
  let boundaryDiv2 = contents.getElementsByClassName(
    `boundaryDiv2${graphicalEffects.x_hash}`
  );
  boundaryDiv1[0].style.display = "none";
  boundaryDiv2[0].style.display = "none";

  // Sets the first index to the current container div.
  indexed[0] = index;
  renderZoomDown(index, calcWidth, points, left, dpi, graphicalEffects);
}

function renderZoomDown(index, calcWidth, points, left, dpi, graphicalEffects) {
  // Renders out the boundary div when the mouse is first clicked.
  let contents = document.getElementById(graphicalEffects.contentsDiv);

  let boundaryDiv1 = contents.getElementsByClassName(
    `boundaryDiv1${graphicalEffects.x_hash}`
  );
  let width = calcWidth * index + (1 / 2) * calcWidth;

  boundaryDiv1[0].style.left = `${width}px`;
  boundaryDiv1[0].style.display = "block";
}

export function zoomUp(index, calcWidth, points, left, dpi, graphicalEffects) {
  // Sets the second index to the current container div.
  indexed[1] = index;
  renderZoomUp(index, calcWidth, points, left, dpi, graphicalEffects);
}

function renderZoomUp(index, calcWidth, points, left, dpi, graphicalEffects) {
  // Renders out the boundary div when the mouse is released.
  let contents = document.getElementById(graphicalEffects.contentsDiv);

  if (indexed[0] != indexed[1]) {
    let boundaryDiv2 = contents.getElementsByClassName(
      `boundaryDiv2${graphicalEffects.x_hash}`
    );
    let width = calcWidth * index + (1 / 2) * calcWidth;

    boundaryDiv2[0].style.left = `${width}px`;
    boundaryDiv2[0].style.display = "block";

    // Everything below handles the positive/negative result when you drag the boundary div.
    let sub;
    let ind1 = indexed[0];
    let ind2 = indexed[1];
    if (ind1 > ind2) {
      sub = points[ind1].y - points[ind2].y;
    } else if (ind2 > ind1) {
      sub = points[ind2].y - points[ind1].y;
    }

    let boundaryDiv1 = contents.getElementsByClassName(
      `boundaryDiv1${graphicalEffects.x_hash}`
    );
    if (sub < 0) {
      boundaryDiv1[0].style.backgroundColor = `${graphicalEffects.lossColor}`;
      boundaryDiv2[0].style.backgroundColor = `${graphicalEffects.lossColor}`;
    } else if (sub >= 0) {
      boundaryDiv1[0].style.backgroundColor = `${graphicalEffects.gainColor}`;
      boundaryDiv2[0].style.backgroundColor = `${graphicalEffects.gainColor}`;
    }
  } else {
    // Handles the situation when the user clicks on the same div twice.
    let boundaryDiv1 = contents.getElementsByClassName(
      `boundaryDiv1${graphicalEffects.x_hash}`
    );
    boundaryDiv1[0].style.display = "none";
  }
}

export function zoomOut(height, width, graphicalEffects) {
  let indexedLength = indexedArray.length;
  if (indexedLength > 1) {
    let modArr = [...modifiedPrevArray];
    let prevArr = [...prevArray];
    let prevObj;
    if (indexedLength > 2) {
      prevObj = indexedArray[indexedLength - 2];
    } else if (indexedLength === 2) {
      prevObj = indexedArray[0];
    }
    modArr.splice(0, prevObj.a);
    modArr.splice(prevObj.b);
    prevArr.splice(0, prevObj.a);
    prevArr.splice(prevObj.b);
    indexedArray.splice(indexedLength - 1);

    let contents = document.getElementById(graphicalEffects.contentsDiv);

    let container = contents.getElementsByClassName(
      `container${graphicalEffects.x_hash}`
    );
    let scalingContainer = contents.getElementsByClassName(
      `scalingContainer${graphicalEffects.x_hash}`
    );

    renderCanvas(height, width, modArr, prevArr, graphicalEffects);
  }
}