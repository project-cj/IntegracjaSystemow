const mongoose = require("mongoose")
const roomSchema = new mongoose.Schema({
    name: {type: String, required: true},
    beds: {type: Number, required: true},
    description: {type: String, required: true}
})
const Room = mongoose.model("Room", roomSchema)

module.exports = Room