/**
 * This file is used to create a local server using express & serve the labyrinth shortest
 * pathfinding algorithm as an API
 * 
 * Input: Maze object
 * Output: Modified Maze Object, minimum amount of steps to complete the maze OR error
 */

 // Create express server
var express = require("express");
  cors = require("cors");
  app = express();
  path = require('path');
  bodyParser = require("body-parser");
  port = process.env.PORT || 3000;
  app.use(bodyParser.json());
  app.use(cors());

  var maze = [];

  app.use(express.static(__dirname + '/dist/labyrinth'));


  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/labyrinth/index.html'));
  });

  /**
   * Check if cell we"re going to is already visited
   * If visited, skip pathfinding through this cell
   * @param {number} x - New cell X
   * @param {number} y  - New cell Y
   * @param {Array} visitedCells  - Array of visited cells
   * @returns {boolean} True if cell we"re going to is not visited
   */

function findCellInVisited(x, y, visitedCells, queue) {
  var toReturn = true;

  // Iterate through visitedCells array and find coincidences
  visitedCells.map(cell => {
    if (cell.x == x && cell.y == y) {
      toReturn = false
      return toReturn
    }
  })
  // Iterate through queue array and find coincidences
  queue.map(cell => {
    if (cell.x == x && cell.y == y) {
      toReturn = false
      return toReturn
    }
  })

  // If new cell wasn"t visited and is not already in queue, returns true
  return toReturn
}


/**
 * 
 * @param {Object} current - Current "location" Object {x, y, path}
 * @param {string} direction - Direction we"re going (i.e. "right", "down")
 */
function switchCell(current, direction) {
  // Define shortcut x, y
  let x = current.x;
  let y = current.y;
  let newPath = current.path.slice()
  
  // Add new visited cell to it"s path
  // It"s used to keep track of visited cells if we reach the end
  newPath.push({"x": current.x, "y": current.y})

  // Check if we"re not moving outside maze"s boundaries
  if (  (x < 0 || y < 0 || x > maze[0].length-1 || y > maze.length-1)) {
    return current
  }

  // Move towards direction in X - Y plane
  switch (direction) {
    case "up":  
      y-=1;
      break;
    case "down":
      y+=1;
      break;
    case "left":
      x-=1;
      break;
    case "right":
      x+=1;  
      break;
    default:
      break;
  }

  // Mark cell as visited and push it to returnable Maze object cells
  // This changes the maze template inside your browser
  if (maze[y] && maze[y][x] && maze[y][x].state != "#") {
    maze[y][x].status="visited"
  }

  // Return cell we"ve moved to
  var newLocation = {"x": x, "y": y, "path": newPath}
  return newLocation

}

/**
 * 
 * @param {Object} location - current location object 
 */
function pathFound(location) {

  // Mark the path it took to complete the maze as "shortest"
  // This changes visuals in the browser
  location.path.map(cell => {
    maze[cell.y][cell.x].status = "shortest"

    // Gotta hardcode this one, sorry
    maze[maze.length-1][maze[0].length-1].status = "shortest"
  })

  // This returns the minimum amount of steps
  return location.path.length
}


/**
 * 
 * @param {Object} startPosition - start x & y
 */
function findPath(startPosition) {

  var x = startPosition.x;
  var y = startPosition.y;

  // Keeps track of visited cells and current queue 
  var queue = [];
  var visitedCells = [];
  var location = {x, y, path: []};
  queue.push(location);

    while (queue.length > 0) {

    // Push current cell to visited and switch cell to the first cell in queue
    visitedCells.push({x, y})
    x = queue[0].x;
    y = queue[0].y;

    // Since we"re already moved here, remove this cell from queue as well
    var current = queue.shift()

    // Each iteration checks if it is possible to go in a particular direction
    // If possible, adds that cell to queue
    // Else if next cell is the bottom right one, return the path

    var newLoc = switchCell(current, "right")
    if (newLoc.x < maze[0].length && findCellInVisited(newLoc.x,  newLoc.y, visitedCells, queue) && maze[newLoc.y][newLoc.x].state != "#") {
      if (newLoc.x == maze[0].length-1 && newLoc.y == maze.length-1) {
        return pathFound(newLoc)
      } else {
        queue.push({"x": newLoc.x, "y":newLoc.y, "path": newLoc.path})
      }
    }

    var newLoc = switchCell(current, "down")
    if (newLoc.y < maze.length && findCellInVisited(newLoc.x,  newLoc.y, visitedCells, queue) && maze[newLoc.y][newLoc.x].state != "#") {
      if (newLoc.x == maze[0].length-1 && newLoc.y == maze.length-1) {
        return pathFound(newLoc)
      } else {
        queue.push({"x": newLoc.x, "y":newLoc.y, "path": newLoc.path})
      }
    }

    var newLoc = switchCell(current, "left")
    if (newLoc.x >= 0 && findCellInVisited(newLoc.x, newLoc.y, visitedCells, queue) && maze[newLoc.y][newLoc.x].state != "#") {
      if (newLoc.x == maze[0].length-1 && newLoc.y == maze.length-1) {
        return pathFound(newLoc)
      } else {
        queue.push({"x": newLoc.x, "y":newLoc.y, "path": newLoc.path})
      }
    }

    var newLoc = switchCell(current, "up")
    if (newLoc.y >= 0 && findCellInVisited(newLoc.x, newLoc.y, visitedCells, queue) && maze[newLoc.y][newLoc.x].state != "#") {
      if (newLoc.x == maze[0].length-1 && newLoc.y == maze.length-1) {
        return pathFound(newLoc)
      } else {
        queue.push({"x": newLoc.x, "y":newLoc.y, "path": newLoc.path})
      }
    }

  }

  // Return false if no valid path is found
  return false
}

// -----------------------------------------------------------------------------------------------------------//

// AUTOMATED TESTS

function _testSwitchCell() {
  // Expect Y do decrease by going up, X by going left, etc.
  const goUp = switchCell({"x":1, "y":2, "path": []}, "up");
  const toCompare = switchCell(goUp, "left");
  const expectedResult = {"x": 0, "y": 1}
  if (toCompare.x == expectedResult.x && toCompare.y == expectedResult.y) {
    return {"_testSwitchCell": "OK"}
  } else {
    return {"_testSwitchCell": "FAILED"}
  }
}


function _testFindCellInVisited() {
  // Expect to find object with number 15
  let expected = 15
  // Iterate through array and find coincidences
  let toReturn = {"_testFindCellInVisited": "FAILED"}
  let array = [{"number": 4}, {"number": 8}, {"number": 15}, {"number": 16}, {"number": 23}, {"number": 42}]
  array.map(element => {
    if (element.number == expected) {
        toReturn = {"_testFindCellInVisited": "OK"}
    }
  })
  return toReturn
}

// Launch a test to see if pathfinding works correctly
function _testPathfinding(testMaze) {
  var expectedResult = 10
  var minimumSteps = findPath({"x":0, "y":0 })
  if (minimumSteps == expectedResult) {
    // Test passed
    return {"_testPathfinding": "OK"}
  } else {
    return {"_testPathfinding": "FAILED"}
  }
}

// -----------------------------------------------------------------------------------------------------------//

// Normalize maze data to match {x, y, state}
function unParseMaze(maze) {
  let unparsedMaze = [];
  for (let y = 0; y < maze.length; y++) {
    let row = []
    for (let x = 0; x < maze[0].length; x++) {
      row.push({"x": x, "y": y, "state": maze[y][x]})
    }
    unparsedMaze.push(row)
  }
  return unparsedMaze
}

app.route("/labyrinth/tests").post((req, res) => {
  // Begin tests and push test with result to array
  testsArray = [];
  testMaze = unParseMaze(req.body);
  maze = testMaze;
  testsArray.push(_testSwitchCell());
  testsArray.push(_testFindCellInVisited());
  testsArray.push(_testPathfinding(testMaze));
  res.status(200).send(testsArray);
})

// Listen for POST requests
app.route("/labyrinth").post((req, res) => {

  // variable maze - array of arrays containing cells
  maze = unParseMaze(req.body)

  // Begin pathfinding from [0, 0]
  var minimumSteps = findPath({"x":0, "y":0 })

  // If maze pathfinding was successful, return code 200 with data
  // Otherwise, return code 400
  minimumSteps == false ? 
    res.status(400).send({
      error: "No valid path found"
    })
  : 
  res.status(200).send(
    {response: minimumSteps,
    data: maze
})
  
})

// Listen for POST requests
app.route("/labyrinth2").post((req, res) => {

  // variable maze - array of arrays containing cells
  maze = unParseMaze(req.body)

  // Begin pathfinding from [0, 0]
  var minimumSteps = findPath({"x":0, "y":0 })

  // If maze pathfinding was successful, return code 200 with data
  // Otherwise, return code 400
  minimumSteps == false ? 
    res.status(400).send({
      error: "No valid path found"
    })
  : 
  res.status(200).send(String(minimumSteps))
  
})




// End of file
app.listen(port, () => {
  console.log(`server running on port ${port}`)
});