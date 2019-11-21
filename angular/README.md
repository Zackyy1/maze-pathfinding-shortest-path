# Labyrinth shortest path finder

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.28.3, later updated to version 7.3.9

Angular 7.2.15

## About

This app is a web page containing a maze and a server. You decide the maze layout: width, height, walls. By pressing the "Begin" button its data is sent to API function, which calculates the shortest path from the top left corner to the bottom right.

## Code overlook

How this app works:
The Maze component has maze, its data and a few inputs. By pressing these inputs, component is communicating with Maze Service.
When the service receives a call to begin pathfinding, it sends a POST request to our API, which then returns the minimum required
steps to complete the maze.
Everything is visualized and made easy to understand.

Enjoy the Labyrinth

## Get started

In your console write the following:
```
$ git clone https://github.com/Zackyy1/maze-pathfinding-shortest-path.git maze-pathfinding-shortest-path
$ cd maze-pathfinding-shortest-path
$ npm i
$ npm rebuild node-sass
$ ng serve
```

In a separate console, in the root folder, enter this:
```
$ npm run server
```

## Running automated tests

API tests are fired whenever you open the app. Make sure the server is running first.
Test results are located in browser console (F12)


To run e2e tests, navigate to root folder and run:
```
$ ng e2e
```

## Martin Goncharov
## Nov 2019
