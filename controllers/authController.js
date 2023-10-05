const userModel = require("../models/userModel.js");
const tokenModel = require("../models/token.js");
const crypto = require("crypto")
const verifications = require("../utils/sendEmail.js")
const register = async (req, res) => {
  try {
    const { name, password, confirmpassword, email } = req.body;
    if (!name || !password || !email || !confirmpassword) {
      return res.status(200).send({
        success: false,
        message: "Invalid details",
      });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exist! Please Login",
      });
    }
    if (password != confirmpassword) {
      return res.status(200).send({
        success: false,
        message: "Passwords don't match",
      });
    }
    const user = await new userModel({
      name,
      email,
      confirmpassword,
      password,
    }).save();
    const token = await new tokenModel({
        userid:user._id,
        token:crypto.randomBytes(32).toString("hex")
    }).save();
    const link = `http://localhost:5173/users/${user._id}/verify/${token.token}`;
    await verifications(user.email,"Verify email" , link);
    res.status(201).send({
      success: true,
      message: "An email has been sent to your account please verify",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyToken = async(req,res) =>{
    try{
        const user = await userModel.findOne({
            _id:req.params._id
        })
        if(!user) return res.status(400).send({
            message:"Invalid Link"
        })
        const token = await tokenModel.findOne({
            userid:user._id,
            token:req.params.token
        })
        if(!token) return res.status(400).send({
            message:"Invalid Link"
        })
        await userModel.updateOne({_id:user._id ,verified:true})
        await tokenModel.remove();
        res.send("Email Verified");
    }catch(error){
        res.status(400).send("An error occured");
    }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(200).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).send({
        success: false,
        message: "User does not exist",
      });
    }
    if (password != user.password) {
      res.status(200).send({
        success: false,
        message: "Passwords don't match",
      });
    }
    if(!user.verified){
        let token = await tokenModel.findOne({
            userid: user._id
        })
        if(!token){
            token = await new tokenModel({
                userid:user._id,
                token:crypto.randomBytes(32).toString("hex")
            }).save();
            const link = `http://localhost:5173/users/${user._id}/verify/${token.token}`;
            await verifications(user.email,"Verify email" , link);
        }
        return res.status(400).send({
            message:"Email sent to your account"
        })
    }

    res.status(201).send({
      success: true,
      message: "Login Successfull",
      user: {
        _id: user._id,
        email: user.email,
        password: user.password,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    });
  }
};



module.exports = { register, login,verifyToken };
