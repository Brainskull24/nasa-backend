const userModel = require("../models/userModel.js");
const JWT = require("jsonwebtoken");
const axios = require("axios");
// const cookieParser = require('cookie-parser');

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
    res.status(201).send({
      success: true,
      message: "Registration Successfull",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User does not exist",
      });
    }

    if (password !== user.password) {
      return res.status(401).send({
        success: false,
        message: "Passwords don't match",
      });
    }

    // const accessToken = generateAccessToken(user);
    // res.cookie('access_token', accessToken, { httpOnly: true });

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7h",
    });
    user.token = token;
    console.log(token);
    return res.status(200).send({
      success: true,
      message: "Login Successful",
      user: {
        _id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({ message: "Enter credentials" });
    }
    const user = await userModel.findOne({ email });
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

const checkSpam = async (email) => {
  try {
    // Escape the email content and wrap it in a valid JSON format
    const emailContent = JSON.stringify({
      api_key: "VdEktNCRivfU5T9U05VLYl79TApGjl4jtXs3a2LK",
      content: email,
    });

    const response = await axios.post(
      "https://api.oopspam.com/v1/spamdetection",
      emailContent, // Use the escaped JSON string as the request body
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "VdEktNCRivfU5T9U05VLYl79TApGjl4jtXs3a2LK",
        },
      }
    );

    const data2 = response.data;
    console.log(data2);
    return res.json(data2);
  } catch (error) {
    console.error("Error making API request:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while making the API request." });
  }
};

module.exports = { register, login, resetpassword,checkSpam };
