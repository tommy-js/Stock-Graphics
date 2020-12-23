import { renderCanvas } from "./renderFunction.mjs";
import {
  reformatPoints,
  calculateCanvasHeight,
  calculateCanvasBase,
} from "../index.mjs";

export function zoom(height, width, points, prePoints, graphicalEffects) {
  let contents = document.getElementById(graphicalEffects.contentsDiv);

  let container = contents.getElementsByClassName(
    `container${graphicalEffects.x_hash}`
  );
  let scalingContainer = contents.getElementsByClassName(
    `scalingContainer${graphicalEffects.x_hash}`
  );

  let pointCopy = [...graphicalEffects.initialValues];
  //
  let prePointCopy = [...graphicalEffects.indexedArray];

  // Checks to make sure that we haven't zoomed in already
  let indexedAccurate;
  if (graphicalEffects.indexed[0] === graphicalEffects.indexed[1]) {
    indexedAccurate = false;
  } else {
    indexedAccurate = true;
  }

  // Splices the array so that we get only the selected region
  if (indexedAccurate === true) {
    if (graphicalEffects.indexed)
      if (graphicalEffects.indexed[0] > graphicalEffects.indexed[1]) {
        prePointCopy.splice(graphicalEffects.indexed[0]);
        prePointCopy.splice(0, graphicalEffects.indexed[1]);

        pointCopy.splice(graphicalEffects.indexed[0]);
        pointCopy.splice(0, graphicalEffects.indexed[1]);
        let x = graphicalEffects.indexed[0];
        let y = graphicalEffects.indexed[1];
        let obj = { a: y, b: x };
        indexedArray.push(obj);
      } else if (graphicalEffects.indexed[1] > graphicalEffects.indexed[0]) {
        prePointCopy.splice(graphicalEffects.indexed[1]);
        prePointCopy.splice(0, graphicalEffects.indexed[0]);

        pointCopy.splice(graphicalEffects.indexed[1]);
        pointCopy.splice(0, graphicalEffects.indexed[0]);
        let x = graphicalEffects.indexed[1];
        let y = graphicalEffects.indexed[0];
        let obj = { a: y, b: x };
        graphicalEffects.indexedArray.push(obj);
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
  graphicalEffects.indexed = [0, 0];
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
  graphicalEffects.indexed[0] = index;
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
  graphicalEffects.indexed[1] = index;
  renderZoomUp(index, calcWidth, points, left, dpi, graphicalEffects);
}

function renderZoomUp(index, calcWidth, points, left, dpi, graphicalEffects) {
  // Renders out the boundary div when the mouse is released.
  let contents = document.getElementById(graphicalEffects.contentsDiv);

  if (graphicalEffects.indexed[0] != graphicalEffects.indexed[1]) {
    let boundaryDiv2 = contents.getElementsByClassName(
      `boundaryDiv2${graphicalEffects.x_hash}`
    );
    let width = calcWidth * index + (1 / 2) * calcWidth;

    boundaryDiv2[0].style.left = `${width}px`;
    boundaryDiv2[0].style.display = "block";

    // Everything below handles the positive/negative result when you drag the boundary div.
    let sub;
    let ind1 = graphicalEffects.indexed[0];
    let ind2 = graphicalEffects.indexed[1];
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
  let indexedLength = graphicalEffects.indexedArray.length;
  if (indexedLength > 1) {
    let prevArr = [...graphicalEffects.modifiedPoints];
    let modArr = [...graphicalEffects.initialValues];
    let prevObj;
    if (indexedLength > 2) {
      prevObj = graphicalEffects.indexedArray[indexedLength - 2];
      console.log(prevObj);
    } else if (indexedLength === 2) {
      prevObj = graphicalEffects.indexedArray[0];
      console.log(prevObj);
    }
    modArr.splice(0, prevObj.a);
    modArr.splice(prevObj.b);
    prevArr.splice(0, prevObj.a);
    prevArr.splice(prevObj.b);
    graphicalEffects.indexedArray.splice(indexedLength - 1);
    console.log(prevArr);

    let contents = document.getElementById(graphicalEffects.contentsDiv);

    let container = contents.getElementsByClassName(
      `container${graphicalEffects.x_hash}`
    );
    let scalingContainer = contents.getElementsByClassName(
      `scalingContainer${graphicalEffects.x_hash}`
    );

    // TEST
    let pointCopy = [...graphicalEffects.initialValues];
    //
    let prePointCopy = [...graphicalEffects.indexedArray];

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
  }
}
