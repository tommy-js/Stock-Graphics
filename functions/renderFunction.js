import { zoomDown, zoomUp, zoom, zoomOut } from "./zoom.js";
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
  // Create the master div for positioning.
  let masterDiv = document.createElement("div");
  masterDiv.setAttribute("id", "masterDiv");
  masterDiv.style = `width: ${
    width + 100
  }px; position: absolute; top: 100px; margin-left: auto; margin-right: auto; left: 0; right: 0;`;
  document.body.appendChild(masterDiv);

  let scaledWidth = "85%";

  // Create a container div to hold all the smaller divs and sit over the graph.
  let container = document.createElement("div");
  container.setAttribute("id", "container");
  container.style = `width: ${scaledWidth}; height: ${height}px; margin-top: 50px; margin-bottom: 50px; position: relative;  margin-left: auto; margin-right: auto; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none;-moz-user-select: none; -ms-user-select: none; user-select: none; outline: none;`;

  // Appends the container div into the main document.
  masterDiv.appendChild(container);

  // Create a container to hold all the vertical values
  let scaleContainer = document.createElement("div");
  scaleContainer.style = `position: absolute; height: ${height}px; width: ${width}px; left: -40px;`;
  scaleContainer.setAttribute("id", "scalingContainer");
  container.appendChild(scaleContainer);

  // Handle resizing so that the canvas will not be blury and will be
  // within necessary aspect ratio.
  let dpi = window.devicePixelRatio;
  renderVerticalValues(height, width, points, prePoints, dpi, graphicalEffects);

  // Define the canvas.
  let canv = document.createElement("canvas");
  canv.setAttribute("id", "canvasID");
  canv.style = `border: 1px solid black; width: 100%; height: 100%; box-sizing: border-box;
    position: absolute;`;

  // Attach the canvas to the body.
  container.appendChild(canv);

  let canvas = document.getElementById("canvasID");
  let ctx = canvas.getContext("2d");
  canvas.setAttribute("height", height * dpi);
  canvas.setAttribute("width", width * dpi);
  ctx.fillStyle = `transparent`;
  ctx.fillRect(0, 0, width * dpi, height * dpi);
  // Calculate the width so that we can define the div widths.
  let calcWidth = calculateWidth(width, points.length);

  let textBar = document.createElement("div");
  textBar.setAttribute("id", "canvasTextBar");
  textBar.style = `width: 200px; position: absolute; top: -50px; margin-left: auto; margin-right: auto; left: 0; right: 0; height: 50px;`;
  container.appendChild(textBar);

  let displayMode = "block";

  let text;

  if (graphicalEffects.ticker) {
    displayMode = "inline-block";
    text = `${graphicalEffects.title} #${graphicalEffects.ticker}`;
  } else {
    text = graphicalEffects.title;
  }

  let title = document.createElement("div");
  title.setAttribute("id", "canvasTitle");
  title.style = `font-size: ${graphicalEffects.fontSize}px; box-sizing: border-box; padding: 10px; display: ${displayMode}; width: 100%; text-align: center;`;
  title.innerHTML = `${text}`;
  textBar.appendChild(title);

  let periodMarker = document.createElement("div");
  periodMarker.setAttribute("id", "canvasPeriodMarker");

  let opac;
  if (graphicalEffects.dateRangeActive === true) {
    opac = 1;
  } else {
    opac = 0;
  }

  periodMarker.style = `width: 200px; left: 0; bottom: -50px; height: 50px; position: absolute; transition: 0.3s; z-index: 99999`;
  periodMarker.style.opacity = opac;
  let index1 = points[0].x;
  let index2 = points[points.length - 1].x;

  let periodText = document.createElement("p");
  periodText.innerHTML = `${index1} - ${index2}`;
  periodMarker.appendChild(periodText);

  container.addEventListener("mouseover", function () {
    periodMarker.style.opacity = 1;
  });
  container.addEventListener("mouseout", function () {
    if (graphicalEffects.dateRangeActive === false) {
      periodMarker.style.opacity = 0;
    } else {
      periodMarker.style.opacity = 1;
    }
  });
  container.appendChild(periodMarker);

  // Creates a button that we can click to zoom in on the graph.
  let zoomButton = document.createElement("button");
  zoomButton.setAttribute("id", "zoom_button");
  zoomButton.style = `width: ${graphicalEffects.buttonSize.width}px; font-size: ${graphicalEffects.buttonFontSize}px; height: ${graphicalEffects.buttonSize.height}px; position: absolute; top: -${graphicalEffects.buttonSize.height}px; left: 0; z-index: 9999;`;
  zoomButton.innerHTML = "zoom";
  zoomButton.addEventListener("click", function () {
    zoom(height, width, points, prePoints, graphicalEffects);
  });
  container.appendChild(zoomButton);

  // Creates a buttom that we can click to zoom back out to where we were before.
  let zoomOutButton = document.createElement("button");
  zoomOutButton.setAttribute("id", "zoom_out_button");
  zoomOutButton.style = `width: ${graphicalEffects.buttonSize.width}px; font-size: ${graphicalEffects.buttonFontSize}px; height: ${graphicalEffects.buttonSize.height}px; position: absolute; top: -${graphicalEffects.buttonSize.height}px; left: 50px; z-index: 9999;`;
  zoomOutButton.innerHTML = "zoom out";
  zoomOutButton.addEventListener("click", function () {
    zoomOut(height, width, graphicalEffects);
  });
  container.appendChild(zoomOutButton);

  // Creates the information div that tells us what the value of the graph is.
  let infoDiv = document.createElement("div");
  infoDiv.setAttribute("id", "infoDiv");
  infoDiv.style = `position: absolute; width: ${graphicalEffects.infoDivWidth}px; top: 30px; background-color: lightgrey; opacity: 0; font-size: ${graphicalEffects.graphFontSize}px; text-align: center; padding: 5px; box-sizing: border-box;`;
  container.appendChild(infoDiv);

  // Creates a vertical value line to sit on the graph and show you where you're highlighting.
  let infoDivLine = document.createElement("div");
  infoDivLine.setAttribute("id", "infoDivLine");
  infoDivLine.style = `position: absolute; height: 100%; width: 1px; border-right: 1px dashed orange;`;
  container.appendChild(infoDivLine);

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
  renderHorizontalValues(calcWidth, prePoints, graphicalEffects);

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
      div.style = `position: absolute; width: ${calcWidth}px; height: 100%; left: ${left}px;`;

      // Calculates the number of pixels we need to move the infoDiv back for it to be centered above the vertical dashed line.
      let calcDivided = graphicalEffects.infoDivWidth / 2;

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
          prePoints[p].y,
          calcDivided,
          calcWidth
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
          prePoints[p].y,
          calcDivided,
          calcWidth
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

      let calculatedLineColor = calculateLineColor(
        points,
        graphicalEffects.lossColor,
        graphicalEffects.gainColor
      );

      // Renders the line running from current one to the next.
      renderLine(
        positions.positioningx1,
        positions.positioningy1,
        positions.positioningx2,
        positions.positioningy2,
        calculatedLineColor,
        graphicalEffects.lineWidth
      );
    }
  }
}

// Returns the line color of the graph depending on gain/loss
function calculateLineColor(points, loss, gain) {
  let firstVal = points[0].y;
  let finalVal = points[points.length - 1].y;
  if (finalVal >= firstVal) {
    return gain;
  } else if (finalVal < firstVal) {
    return loss;
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
  return scaling;
}

// Calculates and returns the height each value should be displayed at.
function verticalValueHeight(canvasHeight, height, v) {
  // let calculatedHeight = height - canvasHeight;
  let calculatedHeight = canvasHeight * v;
  return calculatedHeight;
}

// Actually renders out the vertical values for the graph.

// Get the maximum value on the graph. Then, start from v=0, set the first value since v=0 the height=0 also. Then, multiply successive values of v until v=3.

function renderVerticalValues(
  height,
  width,
  points,
  prePoints,
  dpi,
  graphicalEffects
) {
  let max = maxPoints(points);
  let min = minPoints(points);
  let range = max - min;
  let vertValNum = 6;
  let avgBreak = range / 4;
  let maxDisplay = avgBreak * 5;

  let visualDistance = height / 5;

  let container = document.getElementById("container");
  let scalingContainer = document.getElementById("scalingContainer");

  for (let i = 0; i < vertValNum; i++) {
    let info = document.createElement("div");
    let infoTag = document.createElement("div");
    info.setAttribute("id", `verticalScale${i}`);
    infoTag.setAttribute("id", `verticalScaleDiv${i}`);

    let scaled = i * avgBreak + min;
    let floorScaled = Math.floor(scaled * 100) / 100;

    let vis = i * visualDistance;

    info.innerHTML = `${floorScaled}`;
    info.style = `position: absolute; padding-right: 2px; bottom: ${
      vis - 10
    }px; z-index: 99; height: 20px; background-color: white; font-size: ${
      graphicalEffects.graphFontSize
    }px;`;
    infoTag.style = `bottom: ${vis}px; width: ${
      0.925 * (graphicalEffects.graphWidth + 100)
    }px; position: absolute; height: 25px; margin: 0; border-bottom: 1px solid #E8E8E8;`;
    scalingContainer.appendChild(info);
    scalingContainer.appendChild(infoTag);
  }
}

// Renders out the horizontal values on the graph.
function renderHorizontalValues(calcWidth, points, graphicalEffects) {
  let scaling = declutterHorizontal(points);
  let max = points.length - 1;
  let container = document.getElementById("container");
  for (let v = 0; v < max; v += scaling) {
    let width = v * calcWidth + calcWidth / 2;
    let info = document.createElement("p");
    info.innerHTML = `${points[v].x}`;
    container.appendChild(info);
    info.style = `bottom: 0; left: ${width}px; position: absolute;  font-size: ${graphicalEffects.graphFontSize}px;`;
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
  let posY = modifiedHeight - points[p].y * dpi;
  // Calculates the center of the div.
  // positioningx1 finds the x-pos for the current div.
  // positioningx2 finds the x-pos for the next div.
  let positioningx1 = calculateCenterAlign(calcWidth, left, 5 * dpi, dpi);
  let positioningy1 = posY;
  let leftPosX2 = left + calcWidth;
  let positioningx2;
  let positioningy2;
  if (points[p + 1]) {
    positioningy2 = modifiedHeight - points[p + 1].y * dpi;
    positioningx2 = calculateCenterAlign(calcWidth, leftPosX2, 5 * dpi, dpi);
  } else {
    positioningy2 = posY;
  }
  // console.log(
  //   `x1: ${positioningx1}, x2: ${positioningx2}, y1: ${positioningy1}, y2: ${positioningy2}, posy: ${posY}`
  // );
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
  // Renders from to - equivalent to css styling top: endY.
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
function renderInfoDiv(
  mouseIn,
  x,
  y,
  width,
  height,
  dpi,
  date,
  actualVal,
  calcDivided,
  calcWidth
) {
  let info = document.getElementById("infoDiv");
  let infoLine = document.getElementById("infoDivLine");
  let medCalcWidth = calcWidth / 2;
  if (mouseIn === true) {
    // Displays the height of the hovered element.
    info.innerHTML = `${date}: $${y}`;
    // Styles the component so that it sits just left of the highest point.
    info.style.left = `${x - calcDivided + medCalcWidth}px`;

    infoLine.style.left = `${x + medCalcWidth}px`;
    // Styles the div so that it is visible.
    info.style.opacity = "1";
    // Styles the div line visible.
    infoLine.style.opacity = "1";
  } else {
    // Renders the component invisible.
    info.style.opacity = "0";
    // Renders the div line invisible.
    infoLine.style.opacity = "0";
    info.innerHTML = ``;
  }
}

// Calculates the center of the div.
export function calculateCenterAlign(divWidth, left, radius, dpi) {
  let calculatedPos = left * dpi + (divWidth / 2) * dpi + (radius / 2) * dpi;
  return calculatedPos;
}

// Calculates the width of each component div.
function calculateWidth(width, xPoints) {
  let graphWidth = width / xPoints;
  return graphWidth;
}

export default renderCanvas;
