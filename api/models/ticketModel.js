const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
  title: { type: String, required: true, min: 3 },
  price: { type: Number, required: true },
  from_location: { type: String, required: true },
  to_location: { type: String, required: true },
  to_location_photo_url: { type: String },
});

module.exports = mongoose.model("Ticket", ticketSchema);
