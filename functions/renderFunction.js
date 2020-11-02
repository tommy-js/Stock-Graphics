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
  // Get the container div in which to center the master div.
  let contents = document.getElementById(graphicalEffects.contentsDiv);

  while (contents.firstChild) {
    contents.removeChild(contents.lastChild);
  }

  // Create the master div for positioning.
  let masterDiv = document.createElement("div");
  masterDiv.setAttribute("class", "masterDiv");
  masterDiv.style = `width: ${width + 100}px; position: absolute; left: ${
    graphicalEffects.graphLeft
  }px; right: ${graphicalEffects.graphRight}; margin-left: ${
    graphicalEffects.positioning
  }; margin-right:  ${graphicalEffects.positioning};`;
  contents.appendChild(masterDiv);

  let scaledWidth = "85%";

  // Create a container div to hold all the smaller divs and sit over the graph.
  let container = document.createElement("div");
  container.setAttribute("class", "container");
  container.style = `width: ${scaledWidth}; height: ${height}px; margin-top: 50px; margin-bottom: 50px; position: relative;  margin-left: auto; margin-right: auto; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none;-moz-user-select: none; -ms-user-select: none; user-select: none; outline: none;`;

  // Appends the container div into the main document.
  masterDiv.appendChild(container);

  // Create a container to hold all the vertical values
  let scaleContainer = document.createElement("div");
  scaleContainer.style = `position: absolute; height: ${height}px; width: ${width}px; left: -40px;`;
  scaleContainer.setAttribute("class", "scalingContainer");
  container.appendChild(scaleContainer);

  // Handle resizing so that the canvas will not be blury and will be
  // within necessary aspect ratio.
  let dpi = window.devicePixelRatio;
  renderVerticalValues(height, width, points, prePoints, dpi, graphicalEffects);

  // Define the canvas.
  let canv = document.createElement("canvas");
  canv.setAttribute("class", "canvasID");
  canv.style = `border: 1px solid black; width: 100%; height: 100%; box-sizing: border-box;
    position: absolute; padding-bottom: 40px;`;

  // Attach the canvas to the body.
  container.appendChild(canv);

  let canvas = contents.getElementsByClassName("canvasID");
  let ctx = canvas[0].getContext("2d");
  canvas[0].setAttribute("height", height * dpi);
  canvas[0].setAttribute("width", width * dpi);
  ctx.fillStyle = `transparent`;
  ctx.fillRect(0, 0, width * dpi, height * dpi);
  // Calculate the width so that we can define the div widths.
  let scaled = width * 0.85;
  let calcWidth = calculateWidth(points.length);

  let textBar = document.createElement("div");
  textBar.setAttribute("class", "canvasTextBar");
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
  title.setAttribute("class", "canvasTitle");
  title.style = `font-size: ${graphicalEffects.fontSize}px; box-sizing: border-box; padding: 10px; display: ${displayMode}; width: 100%; text-align: center;`;
  title.innerHTML = `${text}`;
  textBar.appendChild(title);

  let periodMarker = document.createElement("div");
  periodMarker.setAttribute("class", "canvasPeriodMarker");

  let opac;
  if (graphicalEffects.dateRangeActive === true) {
    opac = 1;
  } else {
    opac = 0;
  }

  periodMarker.style = `width: 200px; left: 0; bottom: -50px; height: 50px; position: absolute; transition: 0.3s; z-index: 9`;
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
  zoomButton.setAttribute("class", "zoom_button");
  zoomButton.style = `width: ${graphicalEffects.buttonSize.width}px; color: ${graphicalEffects.buttonFontColor}; background-color: ${graphicalEffects.buttonColor}; border: ${graphicalEffects.buttonBorder}; font-size: ${graphicalEffects.buttonFontSize}px; height: ${graphicalEffects.buttonSize.height}px; position: absolute; top: -${graphicalEffects.buttonSize.height}px; left: 0; z-index: 9; opacity: 0; transition: 0.3s;`;
  zoomButton.innerHTML = "zoom";
  zoomButton.addEventListener("click", function () {
    zoom(height, width, points, prePoints, graphicalEffects);
  });
  container.appendChild(zoomButton);

  // Creates a buttom that we can click to zoom back out to where we were before.
  let zoomOutButton = document.createElement("button");
  zoomOutButton.setAttribute("class", "zoom_out_button");
  zoomOutButton.style = `width: ${graphicalEffects.buttonSize.width}px; color: ${graphicalEffects.buttonFontColor}; background-color: ${graphicalEffects.buttonColor}; border: ${graphicalEffects.buttonBorder}; font-size: ${graphicalEffects.buttonFontSize}px; height: ${graphicalEffects.buttonSize.height}px; position: absolute; top: -${graphicalEffects.buttonSize.height}px; left: 50px; z-index: 9; opacity: 0; transition: 0.3s;`;
  zoomOutButton.innerHTML = "zoom out";
  zoomOutButton.addEventListener("click", function () {
    zoomOut(height, width, graphicalEffects);
  });
  container.appendChild(zoomOutButton);

  masterDiv.addEventListener("mouseover", function () {
    zoomButton.style.opacity = 1;
    zoomOutButton.style.opacity = 1;
  });
  masterDiv.addEventListener("mouseout", function () {
    if (graphicalEffects.dateRangeActive === false) {
      zoomButton.style.opacity = 0;
      zoomOutButton.style.opacity = 0;
    } else {
      zoomButton.style.opacity = 1;
      zoomOutButton.style.opacity = 1;
    }
  });

  // Creates the information div that tells us what the value of the graph is.
  let infoDiv = document.createElement("div");
  infoDiv.setAttribute("class", "infoDiv");
  infoDiv.style = `position: absolute; width: ${graphicalEffects.infoDivWidth}px; top: 30px; background-color: lightgrey; opacity: 0; font-size: ${graphicalEffects.graphFontSize}px; text-align: center; padding: 5px; box-sizing: border-box; z-index: 9`;
  container.appendChild(infoDiv);

  // Creates a vertical value line to sit on the graph and show you where you're highlighting.
  let infoDivLine = document.createElement("div");
  infoDivLine.setAttribute("class", "infoDivLine");
  infoDivLine.style = `position: absolute; height: 100%; width: 1px; border-right: 1px dashed orange;`;
  container.appendChild(infoDivLine);

  // Creates the two boundary divs that appear when you drag the mouse.
  let boundaryDiv1 = document.createElement("div");
  let boundaryDiv2 = document.createElement("div");
  boundaryDiv1.setAttribute("class", "boundaryDiv1");
  boundaryDiv2.setAttribute("class", "boundaryDiv2");
  boundaryDiv1.style = `position: absolute; height: ${height}px; width: ${graphicalEffects.boundaryWidth}px; backgroundColor: ${graphicalEffects.gainColor}; display: none;`;
  boundaryDiv2.style = `position: absolute; height: ${height}px; width: ${graphicalEffects.boundaryWidth}px; backgroundColor: ${graphicalEffects.gainColor}; display: none;`;

  container.appendChild(boundaryDiv1);
  container.appendChild(boundaryDiv2);

  // Function renders all the divs you can highlight over.
  renderDivs(width, points, prePoints, height, dpi, graphicalEffects);
  renderHorizontalValues(calcWidth, prePoints, graphicalEffects);

  function renderDivs(width, points, prePoints, height, dpi, graphicalEffects) {
    let container = contents.getElementsByClassName("container");
    let scaled = width * 0.85;
    let calcWidth = calculateWidth(points.length);
    for (let p = 0; p < points.length; p++) {
      // Calculate height of the maximum point on each div. This is because the
      // canvas measures from top to bottom, meaning out graph needs to be flipped.

      // Calculates the height of the highest point of the graph within this div.
      let compHeight;
      if (points[p]) {
        compHeight = points[p].y;
      } else {
        compHeight = points[p - 1].y;
      }
      // Create divs that we can mouse-over to see information.
      let div = document.createElement("div");
      // Calculate distance to move each div to the right so that they don't. overlap
      div.setAttribute("class", `divEl${p}`);
      let left = calcLeft(p, calcWidth);
      let positions = findPositions(prePoints, p, height, left, dpi);
      div.style = `position: absolute; width: ${calcWidth}px; height: 100%; left: ${left}px;`;

      // Calculates the number of pixels we need to move the infoDiv back for it to be centered above the vertical dashed line.
      let calcDivided = graphicalEffects.infoDivWidth / 2;

      // Function for when we mouse over a div, which makes a circle appear. showing current stock value
      div.addEventListener("mouseover", function () {
        renderInfoDiv(
          true,
          left,
          points,
          p,
          height,
          dpi,
          calcDivided,
          calcWidth,
          graphicalEffects.contentsDiv
        );
      });
      // Function for when we move out of a div, which removes the circle.
      div.addEventListener("mouseout", function () {
        renderInfoDiv(
          false,
          left,
          points,
          p,
          height,
          dpi,
          calcDivided,
          calcWidth,
          graphicalEffects.contentsDiv
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
      container[0].appendChild(div);

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
        graphicalEffects.lineWidth,
        graphicalEffects.contentsDiv
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

  let contents = document.getElementById(graphicalEffects.contentsDiv);

  let container = contents.getElementsByClassName("container");
  let scalingContainer = contents.getElementsByClassName("scalingContainer");

  for (let i = 0; i < vertValNum; i++) {
    let info = document.createElement("div");
    let infoTag = document.createElement("div");
    info.setAttribute("class", `verticalScale${i}`);
    infoTag.setAttribute("class", `verticalScaleDiv${i}`);

    let scaled = i * avgBreak + min;
    let floorScaled = Math.floor(scaled * 100) / 100;

    let vis = i * visualDistance;

    info.innerHTML = `${floorScaled}`;
    info.style = `position: absolute; padding-right: 2px; bottom: ${
      vis - 10
    }px; z-index: 9; height: 20px; background-color: white; font-size: ${
      graphicalEffects.graphFontSize
    }px;`;
    infoTag.style = `bottom: ${vis}px; width: ${
      0.925 * (graphicalEffects.graphWidth + 100)
    }px; position: absolute; height: 25px; margin: 0; border-bottom: 1px solid #E8E8E8;`;
    scalingContainer[0].appendChild(info);
    scalingContainer[0].appendChild(infoTag);
  }
}

// Renders out the horizontal values on the graph.
function renderHorizontalValues(calcWidth, points, graphicalEffects) {
  let contents = document.getElementById(graphicalEffects.contentsDiv);
  let max = points.length - 1;
  let container = contents.getElementsByClassName("container");
  for (let v = 0; v < max; v += graphicalEffects.decluttering) {
    let width = v * calcWidth + calcWidth / 2;
    let info = document.createElement("p");
    info.innerHTML = `${points[v].x}`;
    container[0].appendChild(info);
    info.style = `bottom: 0; left: ${width}px; position: absolute;  font-size: ${graphicalEffects.graphFontSize}px;`;
  }
}

// Calculated the distance right each div should move so that they all sit next to one another.
function calcLeft(p, calcWidth) {
  let calcLeft = p * calcWidth;
  return calcLeft;
}

function findPositions(points, p, height, left, dpi) {
  // vertically to actually appear correct.
  let modifiedHeight = height * dpi;
  let posY = modifiedHeight - points[p].y * dpi;
  // Calculates the center of the div.
  // positioningx1 finds the x-pos for the current div.
  // positioningx2 finds the x-pos for the next div.
  let calcWidth = calculateWidth(points.length);
  let positioningx1 = calculateCenterAlign(points.length, left, 5, dpi);
  let positioningy1 = posY;
  let leftPosX2 = left + calcWidth;
  let positioningx2;
  let positioningy2;
  if (points[p + 1]) {
    positioningy2 = modifiedHeight - points[p + 1].y * dpi;
    positioningx2 = calculateCenterAlign(points.length, leftPosX2, 5, dpi);
  } else {
    positioningy2 = posY;
    positioningx2 = positioningx1 + calcWidth;
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
function renderLine(
  startX,
  startY,
  endX,
  endY,
  lineColor,
  lineWidth,
  contentsDiv
) {
  let contents = document.getElementById(contentsDiv);
  // Renders from to - equivalent to css styling top: endY.
  let canvas = contents.getElementsByClassName("canvasID");
  let ctx = canvas[0].getContext("2d");
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

// Function renders a circle to show us the current value of stock.
// WORK
function renderInfoDiv(
  mouseIn,
  x,
  p,
  currentVal,
  height,
  dpi,
  calcDivided,
  calcWidth,
  contentsDiv
) {
  let contents = document.getElementById(contentsDiv);
  let info = contents.getElementsByClassName("infoDiv");
  let infoLine = contents.getElementsByClassName("infoDivLine");
  let medCalcWidth = calcWidth / 2;
  let avgVal;
  if (p[currentVal - 1]) {
    avgVal = (p[currentVal].y + p[currentVal - 1].y) / 2;
  } else {
    avgVal = p[currentVal].y;
  }
  let roundedAvgVal = Math.round(avgVal * 100) / 100;
  if (mouseIn === true) {
    // Displays the height of the hovered element.
    info[0].innerHTML = `${p[currentVal].x}: ${roundedAvgVal}`;
    // Styles the component so that it sits just left of the highest point.
    info[0].style.left = `${x - calcDivided + medCalcWidth}px`;

    infoLine[0].style.left = `${x + medCalcWidth}px`;
    // Styles the div so that it is visible.
    info[0].style.opacity = "1";
    // Styles the div line visible.
    infoLine[0].style.opacity = "1";
  } else {
    // Renders the component invisible.
    info[0].style.opacity = "0";
    // Renders the div line invisible.
    infoLine[0].style.opacity = "0";
    info[0].innerHTML = ``;
  }
}

// Calculates the center of the div.
export function calculateCenterAlign(len, left, radius, dpi) {
  let containerWidth = document.getElementsByClassName("container");
  let w = containerWidth[0].getBoundingClientRect();
  console.log("width of container: " + w.width);
  let width = w.width / len;
  let calculatedPos = (left + width / 2 + radius * 2) * dpi;
  return calculatedPos;
}

// Calculates the width of each component div.
function calculateWidth(xPoints) {
  let containerWidth = document.getElementsByClassName("container");
  let w = containerWidth[0].getBoundingClientRect();
  console.log("width of container: " + w.width);
  let graphWidth = w.width / xPoints;
  return graphWidth;
}

export default renderCanvas;
