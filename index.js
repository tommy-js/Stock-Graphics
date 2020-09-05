// Entrypoint for graphics engine.
// This project will be a small graphics library, designed for the express purpose of
// rendering stock charts and allowing for user input and interaction.

import renderCanvas from "./functions/renderFunction.js";

let points = [
  { x: 0, y: 50 },
  { x: 1, y: 55 },
  { x: 2, y: 60 },
  { x: 3, y: 25 },
];

renderCanvas(200, 350, points);
