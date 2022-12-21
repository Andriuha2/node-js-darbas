const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.CREATE_USER = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new UserSchema({
    name: req.body.name[0].toUpperCase() + req.body.name.slice(1),
    email: req.body.email,
    password: hashedPassword,
    bought_tickets: [],
    money_balance: req.body.money_balance,
  });

  const jwt_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  const jwt_refresh_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  user
    .save()
    .then((result) => {
      return res.status(200).json({
        response: "User was created successfully",
        user: result,
        jwt_token,
        jwt_refresh_token,
        user: result,
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(400).json({ response: "Fill all fields correctly!" });
    });
};

module.exports.USER_LOGIN = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    console.log(user);

    if (isPasswordMatch) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" },
        { algorythm: "RS256" }
      );

      const jwt_refresh_token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        status: "login successfull",
        jwt_token: token,
        jwt_refresh_token,
      });
    }
    return res.status(404).json({ status: "WRONG EMAIL OR PASSWORD" });
  } catch (err) {
    console.log("req.body", req.body);

    console.log("err", err);
    return res.status(404).json({ status: "WRONG EMAIL OR PASWORD" });
  }
};

module.exports.GET_USER = async function (req, res) {
  const data = await UserSchema.aggregate([
    {
      $lookup: {
        from: "tasks",
        localField: "taskIds",
        foreignField: "id",
        as: "user_tasks",
      },
    },
    { $match: { _id: ObjectId(req.params.id) } },
  ]).exec();

  console.log(data);

  return res.status(200).json({ user: data });
};

module.exports.GET_ALL_USERS = async function (req, res) {
  const data = await UserSchema.find().exec();

  data.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  console.log(data);

  return res.status(200).json({ user: data });
};

module.exports.REFRESH_TOKEN = async (req, res) => {
  try {
    const decoded = jwt.verify(
      req.body.jwt_refresh_token,
      process.env.JWT_SECRET
    );

    const user = await UserSchema.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "Please log in again" });
    }
    const jwt_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return res
      .status(200)
      .json({ jwt_token, jwt_refresh_token: req.body.jwt_refresh_token });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Please log in again" });
  }
};
