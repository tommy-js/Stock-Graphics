// The render function renders the initial graph, starting with either one month
// of data or the maximum data there is available, whichever is smaller.

// The function will take x-axis data and divide out the graph's width by
// the number of available data-points. It will then plot the y-axis values,
// calculate the distance between each point and the ones next to it, and draw
// a line between them.

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
  console.log(height * dpi);
  console.log(width * dpi);
  // }
  // Calculate the width so that we can define the div widths
  let calcWidth = calculateWidth(width, points.length);
  // console.log(calculateWidth(width, points.length));
  // Create a container div to hold all the smaller divs and sit over the graph
  let container = document.createElement("div");
  container.style = `width: ${width}px; height: ${height}px; position: absolute; left: 100px; top: 100px;`;
  document.body.appendChild(container);
  for (let p = 0; p < points.length; p++) {
    // Create divs that we can mouse-over to see information
    let div = document.createElement("div");
    // Calculate distance to move each div to the right so that they don't overlap
    let calcLeft = p * calcWidth;
    div.style = `position: absolute; width: ${calcWidth}px; height: ${height}px;
    border: 1px solid black; left: ${calcLeft}px`;
    // Function for when we mouse over a div, which makes a circle appear showing current stock value
    div.addEventListener("mouseover", function () {
      renderYCircle(true, calcLeft, points[p].y, calcWidth, height, dpi);
    });
    // Function for when we move out of a div, which removes the circle
    div.addEventListener("mouseout", function () {
      renderYCircle(false, calcLeft, points[p].y, calcWidth, height, dpi);
    });
    // Appends each div to the container div
    container.appendChild(div);
  }
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
    circ.clearRect(x, 0, height, width);
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
