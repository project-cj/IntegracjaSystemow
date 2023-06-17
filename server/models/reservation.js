const mongoose = require("mongoose")
const reservationSchema = new mongoose.Schema({
    userMail: {type: String, required: true},
    roomName: {type: String, required: true},
    dateStart: {type: String, required: true},
    dateEnd: {type: String, required: true},
})
const Reservation = mongoose.model("Reservation", reservationSchema)

module.exports = Reservation