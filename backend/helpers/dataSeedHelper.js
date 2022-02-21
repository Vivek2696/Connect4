const db = require("../database/")

// will seed the database with initial data

// assuming (0,0) is top left corner => first column and top row
const gameMovesTypes = [
{x: 0, y:0 },{x: 1, y:0 },{x: 2, y: 0},{x:3 , y: 0 },{x: 4, y: 0},{x: 5, y:0 },{x: 6, y: 0},
{x: 0, y:1 },{x: 1, y:1 },{x: 2, y: 1},{x: 3, y: 1 },{x: 4, y: 1},{x: 5, y:1 },{x: 6, y: 1},
{x: 0, y:2 },{x: 1, y:2 },{x: 2, y: 2},{x: 3, y: 2 },{x: 4, y: 2},{x: 5, y:2 },{x: 6, y: 2},
{x: 0, y:3 },{x: 1, y:3 },{x: 2, y: 3},{x: 3, y: 3 },{x: 4, y: 3},{x: 5, y:3 },{x: 6, y: 3},
{x: 0, y:4 },{x: 1, y:4 },{x: 2, y: 4},{x: 3, y: 4 },{x: 4, y: 4},{x: 5, y:4 },{x: 6, y: 4},
{x: 0, y:5 },{x: 1, y:5 },{x: 2, y: 5},{x: 3, y: 5 },{x: 4, y: 5},{x: 5, y:5 },{x: 6, y: 5},
]
async function seedData(){
    await db.MoveTypes.remove({}, (err)=> {
        
        if(err){
            throw Error("failed to seed data")
        }
        db.MoveTypes.counterReset("_id", async function(err){
            if(err){
                throw Error("failed to reset id counter")
            }
            for(let i = 0; i< gameMovesTypes.length; i++){
                const {x, y} = gameMovesTypes[i]
                await db.MoveTypes.create({x,y})
            }
        })
      
    })
}
 

module.exports = {seedData}