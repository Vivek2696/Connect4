const router = require("express").Router()
const db= require("../database/")
const authMid = require("../middlewares/auth.middleware")
const constantHelper = require("../helpers/constantHelper")
const { ensurePlayerPartOfGamem } = require("../middlewares/auth.middleware")
const gameLogicHelper = require("../helpers/gameLogicHelper")


// api/game/:id/(Get route for viewing a game)
// api/game/:gameId/:userId/(Post route for user's move)


router.route("/")
.post(authMid.isLoggedIn, createGame)
.get(getAllGames)

router.get("/movetypes", getMoveTypes)

router.get("/:id",getGameById)
router.get("/:id/gamemoves", getAllGameMoves)
router.post("/:id/:userId/", authMid.ensurePlayerPartOfGamem, saveGameMove)
router.get("/:id/computermove", getComputerNextMove)
router.post("/:id/allgames/completed", authMid.ensureCorrectUser,  getAllCompletedGamesForUser)



async function createGame(req, res, next){
    try {
        const {gameModeId, PlayerOneId, PlayerTwoId, redColorPlayer} = req.body
        let game
        switch(gameModeId){
            case constantHelper.gameModes.compvcomp:
                game = await db.Game.create({PlayerOneId: constantHelper.comp1Id, PlayerTwoId: constantHelper.comp2Id, redColorPlayer: constantHelper.comp1Id, gameModeId})
                break
            case constantHelper.gameModes.compvhum:
                game = await db.Game.create({PlayerOneId,PlayerTwoId: constantHelper.comp1Id, redColorPlayer: PlayerOneId , gameModeId})
                break
            case constantHelper.gameModes.humvhum:
                if(redColorPlayer){
                    game = await db.Game.create({PlayerOneId, PlayerTwoId, redColorPlayer,gameModeId})

                }else{
                    console.log(PlayerOneId, PlayerTwoId)
                    game = await db.Game.create({PlayerOneId, PlayerTwoId, redColorPlayer: PlayerOneId, gameModeId})
                }
                break
            default:
                return next({status: constantHelper.statusCode.error, message: "Invalid game mode"})

        }
        console.log(game)
        return res.status(constantHelper.statusCode.success).json(game)
        
    } catch (error) {
        console.log(error)
        next({status: constantHelper.statusCode.error, message: "failed to start game"})
    }

}

async function getAllGames(req,res, next){
    
   try {
    let games = await db.Game.find({})
    return res.status(constantHelper.statusCode.success).json(games)
   } catch (err) {
       return next({status: constantHelper.statusCode.error, message: "failed to get all games for all users"})
   }
}

async function getAllCompletedGamesForUser(req, res, next){
    try {
        const {id: userId} = req.params
        console.log(userId)
        const game1 = await db.Game.find({PlayerOneId: userId})
        const game2 = await db.Game.find({PlayerTwoId: userId})
        console.log(game1, game2)
        var games = [ ...game1, ...game2].filter(g=> g.winningPlayerId? true: false)
        return res.status(constantHelper.statusCode.success).json(games)
        
    } catch (err) {
        console.log(err)
        return next({status: constantHelper.statusCode.error, message: "failed to get completed games for user"})
        
    }
}

// will also return all the game moves
async function getGameById(req, res, next){
    try {
        let game = await db.Game.findById(req.params.id)
        res.status(constantHelper.statusCode.success).json(game)
    } catch (err) {
        next({status: constantHelper.statusCode.error, message: "failed to get game"})
    }
    
}


async function saveGameMove(req, res, next){
    try {
        console.log("saving game move")
        const {id: gameId, userId: playerId} = req.params
        const {x, y} = req.body
        let game = await db.Game.findById(gameId);
        const lastMove = await db.GameMove.findById(game.lastMoveId)
        let currentTurnNo = 1
        if(lastMove){
             currentTurnNo = lastMove.turnNo +1
        }
        let {_id: moveTypeId} = await db.MoveTypes.findOne({x, y})
        
        const gameMove = await db.GameMove.create({gameId, playerId, turnNo: currentTurnNo, moveTypeId })
        game.lastMoveId = gameMove._id
        await game.save()
        const gameMoves = await db.GameMove.find({gameId: game._id})
        let winningPlayer = await gameLogicHelper.checkWinningCondition(gameMoves, gameMove.playerId)
        var response =  {winningPlayer, gameMove}
        if(winningPlayer){
            game.winningPlayerId = gameMove.playerId
            await game.save()
            let user = await db.User.findById(gameMove.playerId)
            user.wins = user.wins +1
            await user.save()
            let otherPlayerId = [game.PlayerOneId, game.PlayerTwoId].filter(i=> i != gameMove.playerId)[0]
            if(![constantHelper.comp1Id, constantHelper.comp2Id].includes(otherPlayerId)){
                let user2 = await db.User.findById(otherPlayerId)
                user2.loss = user2.loss +1
                await user2.save()
            }
        }
        res.status(constantHelper.statusCode.success).json(response)
    } catch (err) {
        console.log("error",err)
        next({status: constantHelper.statusCode.error, message: "failed to save game move"})
    }
}

async function getComputerNextMove(req, res, next){
    try {
        const {id: gameId} = req.params
        const gameMoves = await db.GameMove.find({gameId})
        const moveTypes = await db.MoveTypes.find({})
        const game = await db.Game.findById(gameId)
        const mappedMoves = gameMoves.map(m=>{
            let {x,y} = moveTypes.filter(x=> x._id == m.moveTypeId)[0]
            return {...m._doc, x, y}
        })
        var validColumn = false
        var column
        var row = 5
        var movesBelongingToColumn
        while(!validColumn){
            column = Math.floor(Math.random() *7)
            movesBelongingToColumn = mappedMoves.filter(m=> m.x == column)
            if(movesBelongingToColumn.length == 6){
                // column is fully occupied
                continue
            }
            // column is valid
            validColumn = true
        }  
        if(movesBelongingToColumn.length > 0){
            // if the column is occupied
            let smallestRow= 5
            for( let i = 0; i< movesBelongingToColumn.length; i++){
                if (movesBelongingToColumn[i].y < smallestRow){
                    smallestRow = movesBelongingToColumn[i].y
                }
            }
            row = smallestRow - 1
        }
                
       let randomComputerMoveTypeId = moveTypes.filter(t=> t.x == column && t.y == row )[0]._id
        const lastMove = await db.GameMove.findById(game.lastMoveId)
        let newMove
        if(game.gameModeId == constantHelper.gameModes.compvcomp){
            if(!lastMove){
                // first move of the game
                newMove = await db.GameMove.create({playerId: game.PlayerOneId, gameId, turnNo: 1, moveTypeId: randomComputerMoveTypeId})
            }else{
                let playerId
                if(lastMove.playerId == game.PlayerOneId){
                    // next move will be for the second bot
                   playerId = game.PlayerTwoId
                }else{
                    // next  move will be for the first bot
                    playerId = game.PlayerOneId
                }
                newMove = await db.GameMove.create({playerId, gameId, turnNo: lastMove.turnNo +1, moveTypeId: randomComputerMoveTypeId})

            }
        }   
        else if(game.gameModeId == constantHelper.gameModes.compvhum){
            // assumming playertwoid will always be the computer and playoneid will always be the human 
            // for comp v human
            newMove = await db.GameMove.create({playerId: game.PlayerTwoId, turnNo: lastMove.turnNo +1 ,moveTypeId: randomComputerMoveTypeId, gameId})

        }
        game.lastMoveId = newMove._id
        await game.save()
        const allGameMoves = await db.GameMove.find({gameId})
        let winningPlayer = await gameLogicHelper.checkWinningCondition(allGameMoves, newMove.playerId)
        var response = {newMove, winningPlayer} 
        if(winningPlayer){
           
            let otherPlayerId = [game.PlayerOneId, game.PlayerTwoId].filter(i=> i != newMove.playerId)[0]
            if(![constantHelper.comp1Id, constantHelper.comp2Id].includes(otherPlayerId)){
                let user2 = await db.User.findById(otherPlayerId)
                user2.loss = user2.loss +1
                await user2.save()
            }
            
        }      
        
        const {x,y}= await db.MoveTypes.findById(newMove.moveTypeId)
      
        return res.status(constantHelper.statusCode.success).json({...response, x, y})
        
    } catch (err) {
        console.log(err)
        next({status: constantHelper.statusCode.error, message: "failed to get next computer move"})
    }
}


async function getMoveTypes(req, res, next){
    try {
        let moveTypes = await db.MoveTypes.find({})
        res.status(constantHelper.statusCode.success).json(moveTypes)
    } catch (err) {
        next({status: constantHelper.statusCode.error, message: "failed to get move types"})
    }
}

async function getAllGameMoves(req,res, next){

    try {
        const {id: gameId} = req.params;
        const game = await db.Game.findById(gameId)
        if(!game){
            return next({status: constantHelper.statusCode.error, message: "can not find game"})
        }
        const gameMoves = await db.GameMove.find({gameId})
        const moveTypes = await db.MoveTypes.find({})
        const mappedMoves = gameMoves.map( m=> {
            const {x,y} = moveTypes.filter(c=> c._id == m.moveTypeId)[0]
            return {...m._doc, x, y}
        } )
        mappedMoves.sort((a, b)=> a.turnNo > b.turnNo)
        const playerOne = await db.User.findById(game.PlayerOneId)
        let playerTwo = null
        if(game.gameModeId == constantHelper.gameModes.humvhum){
            playerTwo = await db.User.findById(game.PlayerTwoId)
        }
        
        return res.status(constantHelper.statusCode.success).json({gameMoves: mappedMoves, game, playerOne, playerTwo})
    } catch (err) {
        next({status: constantHelper.statusCode.success, message: "failed to get all game moves"})
    }
}
module.exports = router;