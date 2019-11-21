import { Component, OnInit } from "@angular/core";
import { MazeService } from "./shared/maze.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})

/**
 * @param {Array} mazeArray - maze cells
 * @param {boolean} showArray - show or hide raw maze data
 */
export class AppComponent implements OnInit{
  title_1 = "Labyrinth";
  title_2 = "by Martin Goncharov"

  // MazeArray & ShowArray are used to show raw JSON maze data
  mazeArray = []
  showArray = false

  constructor(private mazeService: MazeService) {}

  ngOnInit() {
  }

  // Toggle raw maze JSON visibility
  showMazeArray() {
    this.showArray = !this.showArray
    this.showArray ? this.mazeArray = this.mazeService.maze.cells : null
  }

  // Make a string out of maze data
  _showArray() {
    return JSON.stringify(this.mazeArray).replace("]", "]\n")
  }

}


/**
 * Votendo Test Task
=================

## Task Description

User will send POST request to the application public REST API resource `/labyrinth` 
and must get response with number showing minimum amount of steps that are needed to go through his labyrinth.
Labyrinth is a rectangular table of rows and columns. Maximum size of labyrinth is 30x30. 
Every cell can be either empty (.) or be a wall (#). 
Starting point is located in the upper left point (labyrinth[0][0]) and the end is located the lower right point.
It is allowed to move through empty cells and movements are blocked by walls. 

### Input
Server shall receive JSON array as input. 
Each element in the input array is another array which represents row. 
Each element in a row represents cell. 
Cell content can have one of the possible values: "." or "#" 

**Example input**

```
[
  [".", ".", "."],
  ["#", "#", "."],
  [".", ".", "."],
  [".", "#", "#"],
  [".", ".", "."]
]
```

### Output
Server shall respond with number of minimal steps required to get from the starting point to the end point. 
From the example above the response will be 10. 
Server shall respond with HTTP error in case of invalid input.
 */
