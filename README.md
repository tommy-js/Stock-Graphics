# Stock-Graphics
<h3>A small library for rendering stock charts</h3>
This library is a supplemental package for the work currently being done on GreenStack, a site dedicated to educating everyday people on everything stocks.
<h2>Installation</h2>
Using NPM:

  ```
   npm install Stock-Graphics
  ```
Then, import points and graphicalEffects so that you can render the graph:

```
  import {points, graphicalEffects} from "Stock-Graphics"
```

In order to set points, write in the form

```
  points = [
    {x: "Date", y: 34.64}
    ]
```

And to change the way the graph looks, modify anything in the graphicalEffects object. The object is of the form:

```
  const graphicalEffects = {
  graphHeight: 300 , //Total height of the graph
  graphWidth: 600,  //Total width of the graph
  title: "Apple",   //Name of the stock you wish to render
  ticker: "AAPL",   //Ticker of the stock you wish to render
  fontSize: 22,   //Font size of the title and ticker
  backgroundColor: "white", //Color of the background of the graph. Currently not working
  lineWidth: 5,   //Width in pixels of the graph's lines
  boundaryWidth: 3, //Don't worry about this right now
  gainColor: "green", //Color the graph takes on when there is overall positive growth
  lossColor: "red",   //Color the graph takes on when tehre is overall negative growth
  fillColor: "red",   //Does not do anything. Will be removed.
  dateRangeActive: false,  //Controls whether or not the small date-range indicator at the bottom of the graph is permanently visible.
  graphFontSize: 16,  //Controls the text size of the leftmost vertical values.
  infoDivWidth: 100,  //The width of the small container that tells you the value when you hover over a part of the graph.
};
```

The best way to learn how to use this is simply to play around with it. As a quick example of a working set of point values, here is what I have currently running in my test build:

```
points = [
  { x: "07/01", y: 91.28 },
  { x: "07/02", y: 91.96 },
  { x: "07/03", y: 92.5 },
  { x: "07/04", y: 93.85 },
  { x: "07/05", y: 94.18 },
  { x: "07/06", y: 96.26 },
  { x: "07/07", y: 95.33 },
  { x: "07/08", y: 97.26 },
  { x: "07/09", y: 94.84 },
  { x: "07/10", y: 98.99 },
  { x: "07/11", y: 96.56 },
  { x: "07/12", y: 96.26 },
  { x: "07/13", y: 96.99 },
  { x: "07/14", y: 96.42 },
  { x: "07/15", y: 94.84 },
  { x: "07/16", y: 98.99 },
  { x: "07/17", y: 96.56 },
  { x: "07/18", y: 94.84 },
  { x: "07/19", y: 98.99 },
  { x: "07/20", y: 96.56 },
  { x: "07/21", y: 96.26 },
  { x: "07/22", y: 96.99 },
  { x: "07/23", y: 96.42 },
  { x: "07/24", y: 94.84 },
  { x: "07/25", y: 98.99 },
  { x: "07/26", y: 99.23 },
  { x: "07/27", y: 102.42 },
  { x: "07/28", y: 98.56 },
  { x: "07/29", y: 99.83 },
  { x: "07/30", y: 97.21 },
];
```

Cheers and have fun!
