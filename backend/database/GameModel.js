var mongoose = require("mongoose")
const constantHelper = require("../helpers/constantHelper")


// we are assumming that player one will always go first

const GameSchema = new mongoose.Schema({
   
    PlayerOneId: String,
    PlayerTwoId:  String,
    winningPlayerId:  String,
    lastMoveId: String,
    redColorPlayer: String,
    gameModeId:{
        type: Number,
        required: true
    }
})


const GameModel = mongoose.model(constantHelper.gameModel, GameSchema)

module.exports = GameModel