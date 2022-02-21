# Connect4
Full Stack web application game

![Main GamePlay](https://github.com/Vivek2696/Connect4/blob/features/connect4game_vp/Screeenshots/gameplay1.PNG?raw=true)

## Prerequisite
* Make sure you have the src.zip
  * This folder will contain two subdirectory: backend and frontend
* Install NodeJS
  * if on window, download installer from https://nodejs.org/en/download/
  * after the installation check if node js is installed by opening a command line and executing: “node --version”
* Install MongoDB locally
  * Follow this guide for more detail: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
  * Download the installer from here: https://www.mongodb.com/try/download/community?tck=docs_server
* Install angular-cli
  * open a terminal and run: “npm install -g @angular/cli”
  * Follow this guide for more information: https://cli.angular.io

## Backend
* Start the mongodb server locally
  * open up Service manager in window
    * Find an entry called: MongoDB Server
    * right click and start it
    * ![services](https://github.com/Vivek2696/Connect4/blob/features/connect4game_vp/Screeenshots/services.PNG?raw=true)

* Open a command line
* change directory into the connect4 folder
* change directory into the backend folder, so the directory would be …/connect4/backend
* run “npm install” - this will install all the dependencies for the backend project
* start the server by running “node index.js”
  * you will see something like this
  * ![nodejs](https://github.com/Vivek2696/Connect4/blob/features/connect4game_vp/Screeenshots/nodejs.PNG?raw=true)
  * stopping the server - hit ctrl + c

## Frontend
* Open Command line
* change directory into the connect4 folder
* change directory into the frontend folder, so the directory would be …/connect4/frontend
* run “npm install”
* Then to start the frontend angular server, run : “ng serve”. After compilation you should see like this:
  * ![ngserve](https://github.com/Vivek2696/Connect4/blob/features/connect4game_vp/Screeenshots/ngserve.PNG?raw=true)
* Once the angular server is compiled, it will automatically open the browser to “http://localhost:4200/login” if there are issues just type the preceding URL into the browser

## Demo
![Demo](https://github.com/Vivek2696/Connect4/blob/features/connect4game_vp/Screeenshots/Connect4-Google-Chrome-2022-02-2.gif?raw=true)



