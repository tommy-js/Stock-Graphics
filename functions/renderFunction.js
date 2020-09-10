import { zoomDown, zoomUp, zoom } from "./zoom.js";
// The render function renders the initial graph, starting with either one month
// of data or the maximum data there is available, whichever is smaller.

// The function will take x-axis data and divide out the graph's width by
// the number of available data-points. It will then plot the y-axis values,
// calculate the distance between each point and the ones next to it, and draw
// a line between them.

// The render function will always render two containers to the left and two to the
// right of the maximum available in view. When the user scrolls out it will re-render
// and add more to the sides once the edge of the first container is reached. This way
// it will always appear fluid. Scrolling in will work the same way.

export function renderCanvas(
  height,
  width,
  points,
  scaleX,
  scaleY,
  graphicalEffects
) {
  // Define the canvas
  let canv = document.createElement("canvas");
  canv.setAttribute("id", "canvasID");
  canv.style = `border: 1px solid black; width: ${width}px; height: ${height}px;
  position: absolute; top: 100px; left: 100px;`;
  // Handle resizing so that the canvas will not be blury and will be
  // Attach the canvas to the body
  document.body.appendChild(canv);
  // within necessary aspect ratio
  let dpi = window.devicePixelRatio;
  let canvas = document.getElementById("canvasID");
  let ctx = canvas.getContext("2d");
  canvas.setAttribute("height", height * dpi);
  canvas.setAttribute("width", width * dpi);
  ctx.fillStyle = `${graphicalEffects.backgroundColor}`;
  ctx.fillRect(0, 0, width * dpi, height * dpi);
  // Calculate the width so that we can define the div widths
  let calcWidth = calculateWidth(width, points.length);
  // console.log(calculateWidth(width, points.length));
  // Create a container div to hold all the smaller divs and sit over the graph
  let container = document.createElement("div");
  container.setAttribute("id", "container");
  container.style = `width: ${width}px; height: ${height}px; position: absolute; left: 100px; top: 100px;-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none;-moz-user-select: none; -ms-user-select: none; user-select: none; outline: none;`;

  // Appends the container div into the main document
  document.body.appendChild(container);

  // Creates a button that we can click to zoom in on the graph
  let zoomButton = document.createElement("button");
  zoomButton.setAttribute("id", "zoom_button");
  zoomButton.style = `width: 50px; height: 40px; position: absolute; top: 0; left: 0; z-index: 9999`;
  zoomButton.innerHTML = "zoom";
  zoomButton.addEventListener("click", function () {
    zoom(height, width, points, scaleX, scaleY, graphicalEffects);
    console.log("click zoom");
  });
  container.appendChild(zoomButton);

  // Creates the information div that tells us what the value of the graph is
  let infoDiv = document.createElement("div");
  infoDiv.setAttribute("id", "infoDiv");
  infoDiv.style =
    "position: absolute; height: 25px; border: 1px solid grey; background-color: lightgrey; opacity: 0; transition: 0.3s;";
  container.appendChild(infoDiv);

  // Function renders all the divs you can highlight over
  renderDivs(
    width,
    points,
    height,
    dpi,
    scaleX,
    scaleY,
    graphicalEffects.lineColor,
    graphicalEffects.lineWidth
  );
  renderVerticalValues(height, points);
  renderHorizontalValues(calcWidth, points);
  // Scales the graph to always fit a predetermined size
  // ctx.scale(scaleX, scaleY);

  function renderDivs(
    width,
    points,
    height,
    dpi,
    scaleX,
    scaleY,
    lineColor,
    lineWidth
  ) {
    let container = document.getElementById("container");
    let calcWidth = calculateWidth(width, points.length);
    for (let p = 0; p < points.length; p++) {
      // Calculate height of the maximum point on each div. This is because the
      // canvas measures from top to bottom, meaning out graph needs to be flipped

      // Calculates the height of the highest point of the graph within this div
      let compHeight = points[p].y;
      // Create divs that we can mouse-over to see information
      let div = document.createElement("div");
      // Calculate distance to move each div to the right so that they don't overlap
      div.setAttribute("id", `divEl${p}`);
      let left = calcLeft(p, width, points.length);
      let positions = findPositions(points, p, height, calcWidth, left, dpi);
      div.style = `position: absolute; width: ${calcWidth}px; height: ${height}px; border: 1px solid black; left: ${left}px`;
      // Function for when we mouse over a div, which makes a circle appear showing current stock value
      div.addEventListener("mouseover", function () {
        renderYCircle(
          true,
          left,
          points[p].y,
          calcWidth,
          height,
          dpi,
          scaleY,
          points[p].x
        );
      });
      // Function for when we move out of a div, which removes the circle
      div.addEventListener("mouseout", function () {
        renderYCircle(
          false,
          left,
          points[p].y,
          calcWidth,
          height,
          dpi,
          scaleY,
          points[p].x
        );
      });

      // Function for when we click down on a div, to start "recording"
      div.addEventListener("mousedown", function () {
        zoomDown(p);
      });

      // Function for when we release the mouse button on a div, to stop "recording"
      div.addEventListener("mouseup", function () {
        zoomUp(p, height, width, points, scaleX, scaleY, graphicalEffects);
      });
      // Appends each div to the container div
      container.appendChild(div);
      // Renders the line running from current one to the next
      renderLine(
        positions.positioningx1,
        positions.positioningy1,
        positions.positioningx2,
        positions.positioningy2,
        lineColor,
        lineWidth
      );
      console.log(positions);
    }
  }
}

// Returns the maximum vertical value of the graph
function maxPoints(points) {
  let max = Math.max.apply(
    Math,
    points.map(function (o) {
      return o.y;
    })
  );
  return max;
}

// Returns the minimum vertical value of the graph
function minPoints(points) {
  let min = Math.min.apply(
    Math,
    points.map(function (o) {
      return o.y;
    })
  );
  return min;
}

// Returns a value defining the best scaling to use for the vertical bar on the graph
function declutterVertical(max, min, points) {
  let scaling;
  let verticalDistance = max - min;
  if (verticalDistance >= 0.1) {
    scaling = 0.025;
  }
  if (verticalDistance >= 1 && verticalDistance < 10) {
    scaling = 2.5;
  } else if (verticalDistance >= 10 && verticalDistance < 100) {
    scaling = 25;
  } else if (verticalDistance >= 100 && verticalDistance < 1000) {
    scaling = 250;
  } else if (verticalDistance >= 1000 && verticalDistance < 10000) {
    scaling = 2500;
  } else if (verticalDistance >= 10000 && verticalDistance < 100000) {
    scaling = 25000;
  } else if (verticalDistance >= 100000 && verticalDistance < 1000000) {
    scaling = 250000;
  } else if (verticalDistance >= 1000000) {
    scaling = 2500000;
  }
  return scaling;
}

// Calculates and returns the height each value should be displayed at
function verticalValueHeight(canvasHeight, height) {
  let calculatedHeight = height - canvasHeight;
  console.log(calculatedHeight);
  return calculatedHeight;
}

// Actually renders out the vertical values for the graph
function renderVerticalValues(canvasHeight, points) {
  let max = maxPoints(points);
  let min = minPoints(points);
  let scaling = declutterVertical(max, min, points);
  let container = document.getElementById("container");
  for (let v = 3; v >= 0; v--) {
    let displayedVal = v * scaling;
    let vHeight = verticalValueHeight(canvasHeight, displayedVal);
    let info = document.createElement("p");
    info.innerHTML = `${displayedVal}`;
    container.appendChild(info);
    info.style = `bottom: ${vHeight}px; left: 0; position: absolute;`;
  }
}

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

function calcLeft(p, width, pointsLength) {
  let calcWidth = calculateWidth(width, pointsLength);
  let calcLeft = p * calcWidth;
  return calcLeft;
}

function findPositions(points, p, height, calcWidth, left, dpi) {
  // vertically to actually appear correct.
  let modifiedHeight = height * dpi;
  let posY = modifiedHeight - points[p].y;
  // Calculates the center of the div
  // positioningx1 finds the x-pos for the current div
  // positioningx2 finds the x-pos for the next div
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

// Renders a line, which connect into a graph-pattern
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

// Function renders a circle to show us the current value of stock
function renderYCircle(mouseIn, x, y, width, height, dpi, scaleY, date) {
  let info = document.getElementById("infoDiv");
  if (mouseIn === true) {
    // Displays the height of the hovered element
    info.innerHTML = `${date}: $${y}`;
    // Calculates the height necessary to display the number right above the highest point
    let modifiedHeight = y / dpi;
    // Styles the component so that it sits just above the highest point
    info.style.bottom = `${modifiedHeight}px`;
    // Styles the component so that it sits just left of the highest point
    info.style.left = `${x}px`;
    // Styles the div so that it is visible
    info.style.opacity = "1";
  } else {
    // Renders the component invisible
    info.style.opacity = "0";
    info.innerHTML = ``;
  }
}

// Calculates the center of the div
function calculateCenterAlign(divWidth, left, radius, dpi) {
  let calculatedPos =
    left * dpi + Math.floor(divWidth / 2) * dpi - Math.floor(radius / 2);
  // console.log(calculatedPos);
  return calculatedPos;
}

function calculateWidth(width, xPoints) {
  let graphWidth = width / xPoints;
  return graphWidth;
}

export default renderCanvas;
