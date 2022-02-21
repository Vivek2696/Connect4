var mongoose = require("mongoose")
var constantHelper = require("../helpers/constantHelper")
const AutoIncrement = require('mongoose-sequence')(mongoose);

require("dotenv").config();

const OPTIONS = {
        useNewUrlParser: true, 
        keepAlive: true,
}

mongoose.set("debug", true)


mongoose.Promise = Promise
mongoose.connect(constantHelper.MONGODB_CONNECTION_STRING, OPTIONS , () => {
        // trigger this callback if connection to the mongodb server was successful
        console.log(`Mongodb Connected using Connection String: ${constantHelper.MONGODB_CONNECTION_STRING}`)
})

const moveTypeSchema = require("./MoveTypeLookupModel").plugin(AutoIncrement)
const gameMoveTypeModel = mongoose.model(constantHelper.gameMoveTypeModel, moveTypeSchema)


module.exports.User = require("./userModel")
module.exports.Game = require("./GameModel")
module.exports.MoveTypes = gameMoveTypeModel
module.exports.GameMove = require("./GameMoveModel")


