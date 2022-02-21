



var constants = {
    PORT: 3000,
    MONGODB_CONNECTION_STRING:  !process.env.ENVIRONMENT  || process.env.ENVIRONMENT.toLowerCase() == "dev"? "mongodb://localhost:27017/connect4dev": process.env.MONGODB_PROD_CONNECTION_STRING,
    API_URL_PREFIX: "/connect4/api",
    statusCode:{
        error: 400,
        success: 200
    },
    userModel: "User",
    gameModel: "Game",
    gameMoveTypeModel: "GameMoveType",
    GameMoveModel: "GameMove",
    gameModes: {
        compvcomp: 1,
        compvhum: 2,
        humvhum: 3
    },
    comp1Id: "comp1", 
    comp2Id: "comp2"
    
}


module.exports = constants



