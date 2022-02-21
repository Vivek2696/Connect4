var dotenv = require("dotenv")
dotenv.config()
var express = require("express")
var bodyParser = require('body-parser')
var app = express()
var cors = require("cors")
var helmet = require("helmet")
var constantHelper= require("./helpers/constantHelper")
var userRouter = require("./routers/userRouter")
var gameLogicRouter = require("./routers/gameLogicRouter")
var dataSeedHelper = require("./helpers/dataSeedHelper")
require("./database/") // requiring the index.js to initialize the database
// APP Configuration
app.use(bodyParser.json())
app.use(cors());
app.use(helmet())

dataSeedHelper.seedData() // seeding the database with initial data


//ROUTES
app.use( `${constantHelper.API_URL_PREFIX}/user`, userRouter)
app.use(`${constantHelper.API_URL_PREFIX}/game`, gameLogicRouter)

// Error handler
app.use((err, req, res, next) =>{    
    res.status(err.status || constantHelper.statusCode.error).json({message: err.message || "failed to complete request"})
})


// STARTING SERVER
app.listen(constantHelper.PORT, function (){
    console.log("server is running on port " + constantHelper.PORT)
})



