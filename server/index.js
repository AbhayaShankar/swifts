const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoutes");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.get("/", (req, res) => {
  res.send("GET ROUTE");
});

app.listen(port, (req, res) => {
  console.log(`Listening on ${port}`);
});

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connection to MongoDB successfully established!");
  })
  .catch((err) => {
    console.log("Couldn't connect to MongoDB", err.message);
  });
