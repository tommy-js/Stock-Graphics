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

function renderCanvas(height, width, points) {
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
  // Calculate the width so that we can define the div widths
  let calcWidth = calculateWidth(width, points.length);
  // console.log(calculateWidth(width, points.length));
  // Create a container div to hold all the smaller divs and sit over the graph
  let container = document.createElement("div");
  container.setAttribute("id", "container");
  container.style = `width: ${width}px; height: ${height}px; position: absolute; left: 100px; top: 100px;`;
  document.body.appendChild(container);

  // Function renders all the divs you can highlight over
  renderDivs(width, points, height, dpi);
  renderVerticalValues(height, points);
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

function renderHorizontalValues() {}

function renderDivs(width, points, height, dpi) {
  let container = document.getElementById("container");
  let calcWidth = calculateWidth(width, points.length);
  for (let p = 0; p < points.length; p++) {
    // Calculate height of the maximum point on each div. This is because the
    // canvas measures from top to bottom, meaning out graph needs to be flipped
    // Create divs that we can mouse-over to see information
    let div = document.createElement("div");
    // Calculate distance to move each div to the right so that they don't overlap
    let left = calcLeft(p, width, points.length);
    let positions = findPositions(points, p, height, calcWidth, left, dpi);
    div.style = `position: absolute; width: ${calcWidth}px; height: ${height}px;
    border: 1px solid black; left: ${left}px`;
    // Function for when we mouse over a div, which makes a circle appear showing current stock value
    div.addEventListener("mouseover", function () {
      renderYCircle(true, left, positions.posY, calcWidth, height, dpi);
    });
    // Function for when we move out of a div, which removes the circle
    div.addEventListener("mouseout", function () {
      renderYCircle(false, left, positions.posY, calcWidth, height, dpi);
    });
    // Appends each div to the container div
    container.appendChild(div);
    // Renders the line running from current one to the next
    renderLine(
      positions.positioningx1,
      positions.positioningy1,
      positions.positioningx2,
      positions.positioningy2
    );
    console.log(positions);
  }
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
  let positioningx2 = calculateCenterAlign(calcWidth, leftPosX2, 5 * dpi, dpi);
  let positioningy2;
  if (points[p + 1]) {
    positioningy2 = modifiedHeight - points[p + 1].y;
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

function renderLine(startX, startY, endX, endY) {
  let canvas = document.getElementById("canvasID");
  let ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

// Function renders a circle to show us the current value of stock
function renderYCircle(mouseIn, x, y, width, height, dpi) {
  // console.log(x);
  // Scale the radius of the circle appropriately for the screen size
  let radius = 5 * dpi;
  let canv = document.getElementById("canvasID");
  let circ = canv.getContext("2d");
  let positioning = calculateCenterAlign(width, x, radius, dpi);
  if (mouseIn === true) {
    circ.beginPath();
    circ.arc(positioning, y, radius, 0, 2 * Math.PI);
    circ.stroke();
  } else {
    // Calculates where to place the circle on the canvas so that it is
    // centered within the div the user mouses over
    circ.clearRect(x * dpi, 0, height * dpi, width * dpi);
  }
}

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
