require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const db = require('./db.js')

const userRoutes = require('./routes/userRoutes.js')
const authRoutes = require('./routes/authRoutes.js')
const itemRoutes = require('./routes/itemRoutes.js')


//middleware
app.use(express.json())
app.use(cors())

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/item", itemRoutes)


const port = process.env.PORT

app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
