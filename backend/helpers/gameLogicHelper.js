const db = require("../database/")

async function checkWinningCondition(gameMoves, playerID){

    var board = [...Array(6).keys()].map(k=> [...Array(7).keys()].map(c=> 0))
    const moveTypes = await db.MoveTypes.find({})
    gameMoves.map(x=> ({...x._doc, x: moveTypes.filter(t=> t._id  == x.moveTypeId)[0].x, y: moveTypes.filter(t=> t._id  == x.moveTypeId)[0].y})).forEach(({x,y,playerId})=> {
       let value = 0
        if(playerId == playerID){
            value = 1
        }
        board[y][x] = value
    })

    if(checkRow(board)){
        return true
    }
    if(checkColumn(board)){
        return true
    }
    if(checkDiagonal(board)){
        return true
    }
    return false
}

function checkDiagonal(board){
    let counter = 0;
    //from left to right
    for(let i = 5; i > 2; i --){
        for(let j = 0; j  < 4; j++){
            if(board[i][j] == 1){
                counter++;
                //start checking diagonals
                let iterator = 1;
                while(iterator < 4){
                    if(board[i-iterator][j+iterator] == 1){
                        counter++;
                    }
                    iterator++;
                }
                if(counter == 4){
                    return true; //diagnonal is found
                }
                else{
                    counter = 0; //reset the counter
                }
            }
        }
    }
    counter = 0;
    //from right to left
    for(let i = 5; i > 2; i --){
        for(let j = 6; j  > 2; j --){
            if(board[i][j] == 1){
                counter++;
                //start checking diagonals
                let iterator = 1;
                while(iterator < 4){
                    if(board[i-iterator][j-iterator] == 1){
                        counter++;
                    }
                    iterator++;
                }
                if(counter == 4){
                    return true; //diagnonal is found
                }
                    
                else{
                    counter = 0; //reset the counter
                }  
            }
        }
    }
    return false;
}

function checkRow(board){
    for (let j = 0; j< board.length; j++){
        let counter = 0
        for (let i = 0 ; i< board[0].length ; i++){
            if(board[j][i] == 1){
                counter++
            }else {
                counter = 0
            }
            if(counter == 4){
                return true
            }
        }
    }
    return false
}


function checkColumn(board){
    var counter = 0
    for (let j = 0; j < board[0].length; j++){
        counter = 0
        for (let i = 0; i < board.length; i++){
            if(board[i][j]== 1){
                counter ++
            }else{
                counter = 0
            }
            if(counter == 4){
                return true
            }
        }
    }
    return false
}



module.exports = {checkWinningCondition}