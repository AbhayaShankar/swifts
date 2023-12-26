const userModel = require("../models/userModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  const jwtKey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ id }, jwtKey, { expiresIn: "1d" });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // to check if the user exists with the same email - if yes, then we dont want to create another user
    let user = await userModel.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exist" });

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide valid details" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must contain atleast 6 characters long." });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must contain atleast one lowercase, one Uppercase, one numerical and one Special Character.",
      });
    }

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    res.status(201).json({
      message: "Successfully created",
      id: user._id,
      name,
      email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = createToken(user._id);

    res.status(200).json({
      message: "Successfully Logged in",
      id: user._id,
      name: user.name,
      email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
};

// Find a User
const findUser = async (req, res) => {
  try {
    // req.params would return an object of all the params passed in the url
    const userId = req.params.userId;
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

// Find All Users
const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

module.exports = { registerUser, loginUser, findUser, getUsers };
