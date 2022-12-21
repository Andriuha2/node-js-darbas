const TicketSchema = require("../models/ticketModel");
const UserSchema = require("../models/userModel");

module.exports.INSERT_TICKET = function (req, res) {
  const ticket = new TicketSchema({
    title: req.body.title,
    price: req.body.price,
    from_location: req.body.from_location,
    to_location: req.body.to_location,
    to_location_photo_url: req.body.to_location_photo_url,
  });

  ticket.save().then((result) => {
    return res
      .status(200)
      .json({ response: "Ticket was created successfully", ticket: result });
  });
};
