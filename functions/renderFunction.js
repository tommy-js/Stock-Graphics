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
  // Attach the canvas to the body
  document.body.appendChild(canv);
  // Calculate the width so that we can define the div widths
  let calcWidth = calculateWidth(width, points);
  console.log(calculateWidth(width, points));
  // Create a container div to hold all the smaller divs and sit over the graph
  let container = document.createElement("div");
  container.style = `width: ${width}px; height: ${height}px; position: absolute; left: 100px; top: 100px;`;
  document.body.appendChild(container);
  for (let p = 0; p < points; p++) {
    // Create divs that we can mouse-over to see information
    let div = document.createElement("div");
    // Calculate distance to move each div to the right so that they don't overlap
    let calcRight = calcWidth + p * calcWidth;
    div.style = `position: absolute; width: ${calcWidth}px; height: ${height}px; display:
    inline-block; border: 1px solid black; right: ${calcRight}px`;
    container.appendChild(div);
  }
}

function calculateWidth(width, points) {
  let graphWidth = Math.floor(width / points);
  return graphWidth;
}

export default renderCanvas;
