import { zoomDown, zoomUp, zoom } from "./zoom.js";
// The render function renders the initial graph, starting with either one month
// of data or the maximum data there is available, whichever is smaller.

// The function will take x-axis data and divide out the graph's width by
// the number of available data-points. It will then plot the y-axis values,
// calculate the distance between each point and the ones next to it, and draw
// a line between them.

// The render function will always render two containers to the left and two to the right of the maximum available in view. When the user scrolls out it will re-render and add more to the sides once the edge of the first container is reached. This way it will always appear fluid. Scrolling in will work the same way.

export function renderCanvas(
  height,
  width,
  prePoints,
  points,
  graphicalEffects
) {
  // Define the canvas.
  let canv = document.createElement("canvas");
  canv.setAttribute("id", "canvasID");
  canv.style = `border: 1px solid black; width: ${width}px; height: ${height}px;
  position: absolute; top: 100px; left: 100px;`;
  // Handle resizing so that the canvas will not be blury and will be
  // Attach the canvas to the body.
  document.body.appendChild(canv);
  // within necessary aspect ratio.
  let dpi = window.devicePixelRatio;
  let canvas = document.getElementById("canvasID");
  let ctx = canvas.getContext("2d");
  canvas.setAttribute("height", height * dpi);
  canvas.setAttribute("width", width * dpi);
  ctx.fillStyle = `${graphicalEffects.backgroundColor}`;
  ctx.fillRect(0, 0, width * dpi, height * dpi);
  // Calculate the width so that we can define the div widths.
  let calcWidth = calculateWidth(width, points.length);

  // Create a container div to hold all the smaller divs and sit over the graph.
  let container = document.createElement("div");
  container.setAttribute("id", "container");
  container.style = `width: ${width}px; height: ${height}px; position: absolute; left: 100px; top: 100px;-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none;-moz-user-select: none; -ms-user-select: none; user-select: none; outline: none;`;

  // Create a container to hold all the vertical values
  let scaleContainer = document.createElement("div");
  scaleContainer.style = `position: absolute;height: ${height}px; left: 100px; top: 100px; width: 20px;`;
  scaleContainer.setAttribute("id", "scalingContainer");
  document.body.appendChild(scaleContainer);

  // Appends the container div into the main document.
  document.body.appendChild(container);

  // Creates a button that we can click to zoom in on the graph.
  let zoomButton = document.createElement("button");
  zoomButton.setAttribute("id", "zoom_button");
  zoomButton.style = `width: 50px; height: 40px; position: absolute; top: -50px; left: 0; z-index: 9999;`;
  zoomButton.innerHTML = "zoom";
  zoomButton.addEventListener("click", function () {
    zoom(height, width, points, prePoints, graphicalEffects);
    console.log("click zoom");
  });
  container.appendChild(zoomButton);

  // Creates a buttom that we can click to zoom back out to where we were before.
  let zoomOutButton = document.createElement("button");
  zoomOutButton.setAttribute("id", "zoom_out_button");
  zoomOutButton.style = `width: 50px; height: 40px; position: absolute; top: -50px; left: 50px; z-index: 9999;`;
  zoomOutButton.innerHTML = "zoom out";
  zoomOutButton.addEventListener("click", function () {
    zoomOut();
    console.log("click zoom out");
  });
  container.appendChild(zoomOutButton);

  // Creates the information div that tells us what the value of the graph is.
  let infoDiv = document.createElement("div");
  infoDiv.setAttribute("id", "infoDiv");
  infoDiv.style =
    "position: absolute; height: 25px; border: 1px solid grey; background-color: lightgrey; opacity: 0; transition: 0.3s;";
  container.appendChild(infoDiv);

  // Creates the two boundary divs that appear when you drag the mouse.
  let boundaryDiv1 = document.createElement("div");
  let boundaryDiv2 = document.createElement("div");
  boundaryDiv1.setAttribute("id", "boundaryDiv1");
  boundaryDiv2.setAttribute("id", "boundaryDiv2");
  boundaryDiv1.style = `position: absolute; height: ${height}px; width: ${graphicalEffects.boundaryWidth}px; backgroundColor: ${graphicalEffects.gainColor}; display: none;`;
  boundaryDiv2.style = `position: absolute; height: ${height}px; width: ${graphicalEffects.boundaryWidth}px; backgroundColor: ${graphicalEffects.gainColor}; display: none;`;

  container.appendChild(boundaryDiv1);
  container.appendChild(boundaryDiv2);

  // Function renders all the divs you can highlight over.
  renderDivs(width, points, prePoints, height, dpi, graphicalEffects);
  renderVerticalValues(height, points, prePoints);
  renderHorizontalValues(calcWidth, prePoints);

  function renderDivs(width, points, prePoints, height, dpi, graphicalEffects) {
    let container = document.getElementById("container");
    let calcWidth = calculateWidth(width, points.length);
    for (let p = 0; p < points.length; p++) {
      // Calculate height of the maximum point on each div. This is because the
      // canvas measures from top to bottom, meaning out graph needs to be flipped.

      // Calculates the height of the highest point of the graph within this div.
      let compHeight = points[p].y;
      // Create divs that we can mouse-over to see information.
      let div = document.createElement("div");
      // Calculate distance to move each div to the right so that they don't. overlap
      div.setAttribute("id", `divEl${p}`);
      let left = calcLeft(p, width, points.length);
      let positions = findPositions(prePoints, p, height, calcWidth, left, dpi);
      div.style = `position: absolute; width: ${calcWidth}px; height: ${height}px; border: 1px solid black; left: ${left}px`;
      // Function for when we mouse over a div, which makes a circle appear. showing current stock value
      div.addEventListener("mouseover", function () {
        renderInfoDiv(
          true,
          left,
          points[p].y,
          calcWidth,
          height,
          dpi,
          points[p].x,
          prePoints[p].y
        );
      });
      // Function for when we move out of a div, which removes the circle.
      div.addEventListener("mouseout", function () {
        renderInfoDiv(
          false,
          left,
          points[p].y,
          calcWidth,
          height,
          dpi,
          points[p].x,
          prePoints[p].y
        );
      });

      // Function for when we click down on a div, to start "recording".
      div.addEventListener("mousedown", function () {
        zoomDown(p, calcWidth, points, left, dpi, graphicalEffects);
      });

      // Function for when we release the mouse button on a div, to stop "recording".
      div.addEventListener("mouseup", function () {
        zoomUp(p, calcWidth, points, left, dpi, graphicalEffects);
      });
      // Appends each div to the container div.
      container.appendChild(div);
      // Renders the line running from current one to the next.
      renderLine(
        positions.positioningx1,
        positions.positioningy1,
        positions.positioningx2,
        positions.positioningy2,
        graphicalEffects.lineColor,
        graphicalEffects.lineWidth
      );
      console.log(positions);
    }
  }
}

// Returns the maximum vertical value of the graph.
function maxPoints(points) {
  let max = Math.max.apply(
    Math,
    points.map(function (o) {
      return o.y;
    })
  );
  return max;
}

// Returns the minimum vertical value of the graph.
function minPoints(points) {
  let min = Math.min.apply(
    Math,
    points.map(function (o) {
      return o.y;
    })
  );
  return min;
}

// Returns a value defining the best scaling to use for the vertical bar on the graph.
function declutterVertical(max, min, points) {
  let scaling = max / 4;
  // let verticalDistance = max - min;
  // if (verticalDistance >= 0.1 && verticalDistance < 1) {
  //   scaling = 0.025;
  // }
  // if (verticalDistance >= 1 && verticalDistance < 5) {
  //   scaling = 1;
  // } else if (verticalDistance >= 5 && verticalDistance < 10) {
  //   scaling = 2.5;
  // } else if (verticalDistance >= 10 && verticalDistance < 50) {
  //   scaling = 5;
  // } else if (verticalDistance >= 50 && verticalDistance < 100) {
  //   scaling = 15;
  // } else if (verticalDistance >= 100 && verticalDistance < 200) {
  //   scaling = 25;
  // } else if (verticalDistance >= 200 && verticalDistance < 300) {
  //   scaling = 40;
  // } else if (verticalDistance >= 300 && verticalDistance < 400) {
  //   scaling = 50;
  // } else if (verticalDistance >= 400 && verticalDistance < 500) {
  //   scaling = 75;
  // } else if (verticalDistance >= 500 && verticalDistance < 600) {
  //   scaling = 90;
  // } else if (verticalDistance >= 300) {
  //   scaling = 250;
  // }
  return scaling;
}

// Calculates and returns the height each value should be displayed at.
function verticalValueHeight(canvasHeight, height, v) {
  // let calculatedHeight = height - canvasHeight;
  let calculatedHeight = canvasHeight * v;
  console.log(calculatedHeight);
  return calculatedHeight;
}

// Actually renders out the vertical values for the graph.
// function renderVerticalValues(canvasHeight, points) {
//   let max = maxPoints(points);
//   let min = minPoints(points);
//   let scaling = max / 3;
//   // let scaling = declutterVertical(max, min, points);
//   let container = document.getElementById("container");
//   let scalingContainer = document.getElementById("scalingContainer");
//   for (let v = 3; v >= 0; v--) {
//     let displayedVal = v * scaling;
//     let vHeight = verticalValueHeight(canvasHeight, displayedVal, v);
//     let info = document.createElement("p");
//     info.innerHTML = `${displayedVal}`;
//     info.style = `bottom: ${vHeight}px; left: 0; position: absolute;`;
//     scalingContainer.appendChild(info);
//   }
// }

// Get the maximum value on the graph. Then, start from v=0, set the first value since v=0 the height=0 also. Then, multiply successive values of v until v=3.

function renderVerticalValues(height, points, prePoints) {
  let max = maxPoints(points);
  let scaling = max / 3;
  let scaledPoints = maxPoints(prePoints);
  let actualScaling = scaledPoints / 3;
  let container = document.getElementById("container");
  let scalingContainer = document.getElementById("scalingContainer");

  for (let v = 0; v < 3; v++) {
    let info = document.createElement("p");
    info.setAttribute("id", `verticalScale${v}`);

    let displayedVal = (v * scaling).toFixed(2);
    let actualHeight;
    if (v > 0) {
      actualHeight = (actualScaling * v) / 1.8;
    } else if (v === 0) {
      actualHeight = 0;
    }

    info.innerHTML = `${displayedVal}`;
    info.style = `bottom: ${actualHeight}px; left: 0; position: absolute; height: 0;`;
    scalingContainer.appendChild(info);
  }
}

// Renders out the horizontal values on the graph.
function renderHorizontalValues(calcWidth, points) {
  let scaling = declutterHorizontal(points);
  console.log("scaling:" + scaling);
  let max = points.length - 1;
  let container = document.getElementById("container");
  for (let v = 0; v < max; v += scaling) {
    let width = v * calcWidth + calcWidth / 2;
    console.log("v: " + v);
    let info = document.createElement("p");
    info.innerHTML = `${points[v].x}`;
    container.appendChild(info);
    info.style = `bottom: 0; left: ${width}px; position: absolute;`;
  }
}

// Prevents the graph from becoming too cluttered.
function declutterHorizontal(points) {
  let horizontalDistance = points.length;
  let scaling;
  if (horizontalDistance >= 1 && horizontalDistance < 10) {
    scaling = 3;
  } else if (horizontalDistance >= 10 && horizontalDistance < 100) {
    scaling = 5;
  } else if (horizontalDistance >= 100 && horizontalDistance < 1000) {
    scaling = 200;
  } else {
    scaling = 2000;
  }
  return scaling;
}

// Calculated the distance right each div should move so that they all sit next to one another.
function calcLeft(p, width, pointsLength) {
  let calcWidth = calculateWidth(width, pointsLength);
  let calcLeft = p * calcWidth;
  return calcLeft;
}

function findPositions(points, p, height, calcWidth, left, dpi) {
  // vertically to actually appear correct.
  let modifiedHeight = height * dpi;
  let posY = modifiedHeight - points[p].y;
  // Calculates the center of the div.
  // positioningx1 finds the x-pos for the current div.
  // positioningx2 finds the x-pos for the next div.
  let positioningx1 = calculateCenterAlign(calcWidth, left, 5 * dpi, dpi);
  console.log(left);
  let positioningy1 = posY;
  let leftPosX2 = left + calcWidth;
  let positioningx2;
  let positioningy2;
  if (points[p + 1]) {
    positioningy2 = modifiedHeight - points[p + 1].y;
    positioningx2 = calculateCenterAlign(calcWidth, leftPosX2, 5 * dpi, dpi);
  } else {
    positioningy2 = posY;
  }
  return {
    positioningx1,
    positioningy1,
    positioningx2,
    positioningy2,
    posY,
  };
}

// Renders a line, which connect into a graph-pattern.
function renderLine(startX, startY, endX, endY, lineColor, lineWidth) {
  let canvas = document.getElementById("canvasID");
  let ctx = canvas.getContext("2d");
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

// Function renders a circle to show us the current value of stock.
function renderInfoDiv(mouseIn, x, y, width, height, dpi, date, actualVal) {
  let info = document.getElementById("infoDiv");
  if (mouseIn === true) {
    // Displays the height of the hovered element.
    info.innerHTML = `${date}: $${y}`;
    // Calculates the height necessary to display the number right above the highest point.
    let modifiedHeight = actualVal / dpi;
    // Styles the component so that it sits just above the highest point.
    info.style.bottom = `${modifiedHeight}px`;
    // Styles the component so that it sits just left of the highest point.
    info.style.left = `${x}px`;
    // Styles the div so that it is visible.
    info.style.opacity = "1";
  } else {
    // Renders the component invisible.
    info.style.opacity = "0";
    info.innerHTML = ``;
  }
}

// Calculates the center of the div.
export function calculateCenterAlign(divWidth, left, radius, dpi) {
  let calculatedPos =
    left * dpi + Math.floor(divWidth / 2) * dpi - Math.floor(radius / 2);
  return calculatedPos;
}

// Calculates the width of each component div.
function calculateWidth(width, xPoints) {
  let graphWidth = width / xPoints;
  return graphWidth;
}

export default renderCanvas;
