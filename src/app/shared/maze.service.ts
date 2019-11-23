import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// import { map, catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Maze } from "./Maze";
import { BehaviorSubject, Observable } from "rxjs";
import { isNumber } from 'util';
const API_URL = environment.apiUrl

export interface MazeCells {
  _body: string;
  cells: any[]
}


@Injectable()
/**
 * Maze service
 * 
 * This service stores Maze object and makes it reachable
 * from all components. Also stores neccessary functions/methods
 * for maze to send to API.
 * 
 * @param {int}        sizeX -  Maze grid width
 * @param {int}        sizeY -  Maze grid height
 * @param {Maze}       maze - Maze object
 * @param {string[]}   visitedCells - Visited cells for pathfinding algorithms
 * @param {string}     popup - A player pawn, storing currect location
 * @param {Observable} observablePopup
 * 
 * @return {string} Returns information about maze completion
 */

export class MazeService {

  constructor(
    private http: HttpClient
  ) { 
    this.popup= "";
    this.observablePopup= new BehaviorSubject<string>(this.popup);  
  }

  sizeX: number = 5
  sizeY: number = 5
  maze = new Maze(this.sizeX, this.sizeY)
  visitedCells: string[] = []
  popup
  observablePopup
  testMaze: Array<any> = [ [".", ".", "."],

  ["#", "#", "."],
  [".", ".", "."],
  [".", "#", "#"],
  [".", ".", "."] ]

  // Update popup value for other components dynamically
  eventChange() {
    this.observablePopup.next(this.popup);
  }

  // Method to send GET request
  public getTestsRequest(): Observable<any> {
    return this.http.post(API_URL+"/labyrinth/tests", this.testMaze).pipe(response => {
      return response
    })
  }
  
/**
   * Run automated tests inside API by sending a GET request to "labyrinth/tests"
   */
  runTests() {
    this.getTestsRequest()
          .subscribe(
            (e) => {
            console.log("Test results:", e)
          })
  }

  /**
   * Parse maze from initial look to array of arrays with # and . (short array)
   */
   parseMaze(maze) {
     let parsedMaze = []
     maze.map(y => {
       let row = []
       y.map(x => {
         x.state ? row.push(x.state) : row.push(x)
       })
       parsedMaze.push(row)
     })
     return parsedMaze
   }

   /**
    * // Unparse short maze data to full extent (With x, y and state)
    * @param maze - short maze array
    */
  unParseMaze(maze) {
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
  
  beginPathFind(type, maze){
    const that = this;
    // postMaze recieves minimal array input (elements are either '.' or '#')
    this.postMaze(type, this.parseMaze(maze))
    .subscribe(
      (e) => {


        // This is the response from API, containing a number if an array is POSTed,
        // or a modified Maze if sent from the UI maze
        const response = e

        console.log(response)
        
        // Update maze with modified one
        // Update popup value if maze pathfinding was successful
        // If response is just a number, leave maze as it is
        if (!e.error && !isNumber(e)) {
          that.maze.cells = e.data
          that.popup = "Steps taken: " + e.response 

        } else if (isNumber(e)) {
          that.popup = "Steps taken: " + e;
        } else {
          that.popup = "ERROR: No valid path found"
        }

        // Update steps counter for maze component
        this.eventChange()
    })
  }


  // Mark all cells as unvisited for the maze to function properly
  resetMazeCells() {
    this.maze.cells.map(y => {
      y.map(x => {
        x.status = "unvisited"
      })
    })
  }


  /**
   * This method sends a POST request to our server
   * and returns an answer of minimum steps required
   * 
   * @param maze - Maze object
   * @param type - which POST request to send ("/labyrinth" or "/labyrinth2")
   * "/Labyrinth" returns an object with answer and modified maze data
   * the data affects visuals and shows the shortest path
   * 
   * "/Labyrinth2" returns a number of minimum steps and maze is not changed visually
   * 
   */
public postMaze(type, maze): Observable<any> {

  // Reset maze
  this.resetMazeCells()

  this.popup = ""
  this.eventChange()

  // Send POST request
  return this.http.post(API_URL+"/" + type, maze).pipe(response => {
    return response
  })
  }


  // Error handler
  private handleError (error: Response | any) {
    console.error("ApiService::handleError", error);
    return Observable.throw(error);
  }
}


