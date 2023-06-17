const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    values: { type: Array, required: true },
})
const Item = mongoose.model("Item", itemSchema)

module.exports = Item