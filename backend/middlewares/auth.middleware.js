const constantHelper = require("../helpers/constantHelper")
const jwt = require("jsonwebtoken")
const db = require("../database/")
async function ensureCorrectUser(req, res, next){
    try {
        const {jwtToken} = req.body
        jwt.verify(jwtToken, process.env.JWT_KEY, (err, decoded)=> {
            if(decoded && (decoded._id == req.params.id|| decoded._id == req.body.user_id)){
                return next()
            }
            return next({status:constantHelper.statusCode.error, message: "Not authorized"})
        })
    } catch (err) {
        return next({status:constantHelper.statusCode.error, message: "Not authorized"})
    }
}

async function isLoggedIn(req, res, next){
    try {
        jwt.verify(req.body.jwtToken, process.env.JWT_KEY, (err, decoded)=> {
            if(decoded){
                return next()
            }
            return next({status: constantHelper.statusCode.error, message: "not authorized"})
        })
        
    } catch (err) {
        return next({status: constantHelper.statusCode.error, message: "not authorized"})
    }
}

// middlware for making sure that the user is part of the game
async function ensurePlayerPartOfGamem(req, res, next){
    try{
        jwt.verify(req.body.jwtToken, process.env.JWT_KEY, (err, decoded)=> {
            if (decoded && decoded._id == req.params.userId){
                return next()
            }
            return next({status: constantHelper.statusCode.error, message: "not authorized"})
        })
    }catch(err){
        return next({status: constantHelper.statusCode.error, message: "not authorized"})
    }
    

}

module.exports = {ensureCorrectUser, isLoggedIn, ensurePlayerPartOfGamem}