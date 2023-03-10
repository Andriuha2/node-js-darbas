const express = require("express");
const bodyParser = require("body-parser");
const tasksRoutes = require("./api/routes/tickets");
const usersRoutes = require("./api/routes/user");

const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const app = express();

var cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true })
  .then(console.log("connected"))
  .catch((err) => {
    console.log("@@@@@@@@@@@@@@@@@");
    console.log(err);
  });

app.use(tasksRoutes);
app.use(usersRoutes);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.listen(3000);
