import { Component, OnInit } from "@angular/core";
import { MazeService } from "../shared/maze.service";

/**
 * Maze Component
 * 
 * Contains maze, it's layout and primary functionality features
 * Stores current maze, and can modify itself
 * 
 * Methods:
 * @method setCustomMaze(e) - Applies custom maze (on input change)
 * @method stringify(json) - JSON.stringify shortcut for template
 * @method submitCustomMaze(e) - Send POST request with custom Maze
 * @method toggleCells(e) - show / hide cell values instead of images
 * @method showCellValues(cell) - Applies toggleCells value to a cell
 * @method isLastCell(cell) - Checks if cell is the end point
 * @method start() - Send POST request with drawn maze (With visuals)
 * @method buildMaze() - Builds maze template from maze data
 * @method changeSize(req,e) - Changes maze size from input
 * @method changeState(x,y) - toggles path or wall (. or #) state in a cell
 * @method updateCustomMaze() - Custom maze input is changed live
 * @method onClick(e, cell) - Updates cell value and updates custom maze (cell.click)
 * 
 * Variables:
 * @param {Observable} observablePopup - listener for Service value
 * @param {Object} maze - current maze template
 * @param {int} sizeX
 * @param {int} sizeY
 * @param {string} popup - popup message
 * @param {Array} customMaze - custom maze array
 * @param {boolean} showCells - show cell values?
 * @param {string} customMazeDefault - custom maze string
 */

@Component({
  selector: "app-maze",
  templateUrl: "./maze.component.html",
  styleUrls: ["./maze.component.scss"]
})

export class MazeComponent implements OnInit {

  constructor(private mazeService: MazeService) {
    
   }

  
  ngOnInit() {
    // Subscribe to popup value for this component
    this.observablePopup = this.mazeService.observablePopup
      .subscribe(item => {
        this.popup= item;    
      })


    // Run tests
    // Results are available inside browser console
    this.mazeService.runTests();

    // Build maze cells
    this.buildMaze()

    this.customMaze = this.mazeService.parseMaze(this.maze.cells)

  }

  observablePopup: any;
  maze = this.mazeService.maze
  sizeX = this.mazeService.sizeX
  sizeY = this.mazeService.sizeY
  popup: string
  customMaze = []
  showCells = false;
  customMazeDefault = []

  // Check if JSON is valid
  isValidArray(str) {
    try {
      JSON.parse(str);
  } catch (e) {

      return false;
  }
  return true;
  }

  // Change custom maze variable when custom maze input is made
  // Detect errors
  setCustomMaze(e) {
    let cells = e.target.value
    let tryParse = this.isValidArray(cells)

    // Make sure maze is parsable. If true, parse it
    let newMaze = tryParse ? this.customMaze = JSON.parse(cells) : []

    // Check for walls at the start & end
    if (newMaze[0][0] != "#" && newMaze[newMaze.length-1][newMaze.length-1] != "#") {
    } else {
      alert("Invalid maze input: No walls allowed at [0, 0] and bottom right corner!")
      newMaze[0][0] = "."
      newMaze[newMaze.length-1][newMaze.length-1] = "."
    }
    tryParse ? 
      this.mazeService.maze.cells = this.mazeService.unParseMaze(this.customMaze)
      : (this.customMaze = [])
    this.updateCustomMaze()
  }
   
  stringify(json) {
    return JSON.stringify(json)
  }

  // Change current maze to custom maze data
  submitCustomMaze(e) {
    e.preventDefault()
    // console.log('Submitting', this.customMaze)
    if (this.customMaze.length > 0) {
      this.mazeService.beginPathFind("labyrinth2", this.customMaze)
    } else {
      this.popup = "Invalid custom maze data"
    }
  }
 

  toggleCells(e) {
    // If true, shows simpler data visuals
    this.showCells = e.target.checked
  }

  showCellValues(cell) {
    // Only show each cell data if it"s not image
    if (this.showCells) {
      return cell.state
    }
    
  }  

  // Check if current cell is the "end" (bottom right corner)
  isLastCell(cell) {
    return (cell.x == this.maze.cells[0].length-1 && cell.y == this.maze.cells.length-1)
  }

  // Init send maze to API
  start() {
    this.mazeService.beginPathFind("labyrinth", this.maze.cells)
  }

  /**
   * Maze is built every time it needs an update,
   * i.e. when the size is changed
   */
  buildMaze() {
    // clear maze
    this.maze.cells = []

    // Simple wall check

    // Build maze and fill with arrays
    for (let rows = 0; rows < this.sizeY; rows++) {
      const newRow = []
      for (let cell = 0; cell < this.sizeX; cell++) {
        newRow.push({"x": cell, "y": rows, "state": ".", "status": "unvisited"})
      }
      this.maze.cells.push(newRow)
    }
  }

  /**
   * 
   * @param req - requested dimension change
   * @param e - event of input
   */
  changeSize(req ,e) {
    if (req == "width") {
      this.sizeX = e.target.value
    } else {
      this.sizeY = e.target.value
    }

    // Check if maze size x or y is not bigger than 30
    if (e.target.value < 31 && e.target.value > 0) {
      this.buildMaze()
    } else {
      alert("Maze size should be between 1 and 30")
      if (e.target.value > 30) {
        e.target.value = 30
      } else {
        e.target.value = 1
      }
    }
  }

  // Change state of cell when clicked to wall or back to empty space
  changeState(x, y) {
    this.maze.cells[x][y].status = "wall"
    this.maze.cells[x][y].state && this.maze.cells[x][y].state == "#" ? this.maze.cells[x][y].state = "." : this.maze.cells[x][y].state == "." ? this.maze.cells[x][y].state = "#" : this.maze.cells[x][y].state = "."
  }

  // Show current maze parsed JSON
  updateCustomMaze() {
    let parsed = this.mazeService.parseMaze(this.maze.cells)
    this.customMaze = parsed
  }

  // Cell click event
  onClick(e, cell) {
    
    if (cell.x == 0 && cell.y == 0) {
      alert("Wall cannot be placed inside entry point")
    } else if (cell.x == this.maze.cells[0].length-1 && cell.y == this.maze.cells.length-1) {
      alert("Wall cannot be placed at the end point")
    } else {
      this.changeState(cell.y, cell.x)
      this.updateCustomMaze();
    }
  }

}
