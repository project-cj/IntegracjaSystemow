const mongoose = require("mongoose")
require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.DATABASE}/?retryWrites=true&w=majority`, { useNewUrlParser: true })
    .then((result) => {
        console.log("Połączono z bazą")
    }).catch((err) => {
        console.log("Nie można połączyć się z MongoDB. Błąd: " + err)
})

module.exports = mongoose