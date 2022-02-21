const router = require("express").Router()
const db = require("../database/")
const constantHelper = require("../helpers/constantHelper")
const jwt = require("jsonwebtoken")
const authMid = require("../middlewares/auth.middleware")

// ROUTES
router.post("/", createUser)
router.post("/login", authenticateUser)
router.get("/:id", getUserInfo)
router.get("/:id/gamestats",  getUserStat)
router.put("/:id", authMid.ensureCorrectUser, updateUserInfo)
router.delete("/:id", authMid.ensureCorrectUser, deleteUser)


// function for creating new user
async function createUser(req, res, next) {
    try{
        const {firstName, lastName, email, password, dob} = req.body;
        const user = await db.User.create({firstName, lastName, email, password, dob});
        const {_id,  wins, loss, } = user
        const jwtToken = jwt.sign({_id, firstName, lastName, email}, process.env.JWT_KEY);
        res.status(constantHelper.statusCode.success).json({ _id, jwtToken, firstName, lastName, email, wins, loss, dob, message: "user has been created!"})

    }catch(e){
        next({status: constantHelper.statusCode.error,  message: "failed to create user. please try again later"})
    }
}

// function for loggin in a user

async function authenticateUser(req, res, next){
    try {
       const {email, password} = req.body
       const user = await db.User.findOne({email});
       let isMatch = false
        if(user){
            isMatch = await user.comparePassword(password)
        }
       if(!isMatch){
           return next({status: constantHelper.statusCode.error, message: "Incorrect email or password"})
        }
        const {_id, firstName, lastName, wins, loss, dob} = user
        const jwtToken = jwt.sign({_id, firstName, lastName, email}, process.env.JWT_KEY);

        res.status(constantHelper.statusCode.success).json({ _id, jwtToken, firstName, lastName, email, wins, loss, dob, message: "user has been authenticated!"})

    } catch (err) {
       res.status({status: constantHelper.statusCode.error, message: "incorrect email or password"})
    }
}


// function for getting public user info

async function getUserInfo(req, res, next){
    try {
        const {id} = req.params
        const user = await db.User.findById(id)
        if(user){
            const {firstName, lastName, email, wins, loss, dob} = user;
            return res.status(constantHelper.statusCode.success).json({firstName, lastName, email, wins, loss, dob})
        }
        next({status: constantHelper.statusCode.error, message: "User not found"})      
        
    } catch (err) {
        next({status: constantHelper.statusCode.error, message: "User not found"})
    }
}


async function getUserStat(req, res, next){
    try {
        const user = await db.User.findById(req.params.id)
        if(user){
            const {firstName, lastName, win, loss} = user;
            return res.status(constantHelper.statusCode.success).json({firstName, lastName, win, loss})
        }
    } catch (err) {
        return next({status: constantHelper.statusCode.error, message: "Unable to get user stat"})
    }
}


// will require user authentication before updating. see auth.middleware.js
async function updateUserInfo(req, res, next){
    try {
        const newInfo = {firstName:req.body.firstName,lastName: req.body.lastName,email: req.body.email, dob: req.body.dob}
        const user = await db.User.findByIdAndUpdate(req.params.id, newInfo, {new:true})
        if(!user){
            return next({status: constantHelper.statusCode.error, message: "user not found"})
        }
        if(req.body.password){
            // user is updating password
            user.password = req.body.password
            await user.save()
        }
        const {firstName, lastName, dob, email, wins, loss} = user
        res.status(constantHelper.statusCode.success).json({firstName, lastName, dob, email, wins, loss})
        
    } catch (error) {
        next({status: constantHelper.statusCode.error,message: "unable to update user info"})
    }
}

async function deleteUser(req, res, next){
    try {
        await db.User.findByIdAndRemove(req.params.id)
        return res.status(constantHelper.statusCode.success).json("user deleted")
    } catch (err) {
        next({status: constantHelper.statusCode.error, message: "failed to delete user"})
    }
}

module.exports = router;