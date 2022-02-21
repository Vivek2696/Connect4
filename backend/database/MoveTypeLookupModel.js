var mongoose = require("mongoose")
const constantHelper = require("../helpers/constantHelper")
const gameMoveTypeSchema = new mongoose.Schema({
  _id: Number,
   x: Number,
   y: Number,
   
}, {_id: false})


module.exports = gameMoveTypeSchema