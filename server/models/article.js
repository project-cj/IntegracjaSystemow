const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema({
    aggregateId: { type: String, required: true },
    values: { type: Array, required: true },
})
const Article = mongoose.model("Article", articleSchema)

module.exports = Article