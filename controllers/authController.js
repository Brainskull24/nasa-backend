const userModel = require("../models/userModel.js");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id },'shhhhh' , 
    {
    expiresIn: '7d',
  });
};

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
    const accessToken = generateAccessToken(user);
    res.cookie('access_token', accessToken, { httpOnly: true });
    res.status(201).send({
      success: true,
      message: "Registration Successfull",
      user,
      accessToken, 
    });
  } catch (error) {
    console.log(error);
  }
};

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
    const accessToken = generateAccessToken(user);
    res.cookie('access_token', accessToken, { httpOnly: true });
    res.status(201).send({
      success: true,
      message: "Login Successfull",
      user: {
        _id: user._id,
        email: user.email,
        password: user.password,
      },
      accessToken, 
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { email, password} = req.body;
    if (!email || !password) {
      res.status(400).send({ message: "Enter credentials" });
    }
    const user = await userModel.findOne({email})
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid User",
      });
    }
    await userModel.findByIdAndUpdate(user._id, { password: password });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

module.exports = { register, login,resetpassword };
