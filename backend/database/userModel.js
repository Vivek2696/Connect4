var mongoose = require("mongoose")
const constantHelper = require("../helpers/constantHelper")
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    wins: { type: Number, default: 0} ,
    loss: {type: Number, default: 0}

})
userSchema.pre('save', async function (next){
    try{
        if(!this.isModified('password')){
            return next();
        }
        let hashedPass = await bcrypt.hash(this.password, 10);
        this.password = hashedPass;
        return next();
    
    }catch(err){
        return next({status: constantHelper.statusCode.error, message: "incorrect email or password"}); //  passing an error to next will trigger the error handler middleware
    }
});

userSchema.methods.comparePassword = async function(pass, next) {
    try{
        const isMatched = await bcrypt.compare(pass, this.password)
        return isMatched
    }catch(e){
        next({status: constantHelper.statusCode.error, message: "failed to validate user"})
    }
}


const usersModel = mongoose.model(constantHelper.userModel, userSchema)

module.exports = usersModel
