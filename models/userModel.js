const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type: String,
        required:true
    },
    verified: {
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("user",userSchema);