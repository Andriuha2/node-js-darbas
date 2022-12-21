const express = require("express");
const router = express.Router();
const { INSERT_TICKET } = require("../controllers/ticket");

router.post("/insertTicket", INSERT_TICKET);

module.exports = router;
