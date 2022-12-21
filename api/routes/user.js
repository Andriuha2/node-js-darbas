const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const {
  CREATE_USER,
  USER_LOGIN,
  REFRESH_TOKEN,
  GET_ALL_USERS,
  GET_USER,
  // BUY_TICKET,
  // GET_ALL_WITH_TICKETS,
  // GET_ALL_BY_ID_WITH_TICKETS,
} = require("../controllers/user");

router.post("/singUp", CREATE_USER);

router.post("/login", USER_LOGIN);

router.post("/refreshToken", REFRESH_TOKEN);

router.get("/getAllUsers", auth, GET_ALL_USERS);

router.get("/getUser/:id", auth, GET_USER);

// router.post("/buyTicket", auth, BUY_TICKET);

// router.get("/getAllUsersWithTickets", auth, GET_ALL_WITH_TICKETS);

// router.get("/getUserByIdWithTickets/:id", auth, GET_ALL_BY_ID_WITH_TICKETS);

module.exports = router;
