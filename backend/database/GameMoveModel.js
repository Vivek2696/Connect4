var mongoose = require("mongoose")
const constantHelper = require("../helpers/constantHelper")
const GameMoveSchema = new mongoose.Schema({

    gameId:  String,
    playerId:  String,
    moveTypeId: {
        type: Number,
        required: true
    },
    turnNo: Number
    
})

const GameMoveModel = mongoose.model(constantHelper.GameMoveModel, GameMoveSchema)

module.exports = GameMoveModel