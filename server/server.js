require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const db = require('./db.js')

const userRoutes = require('./routes/userRoutes.js')
const authRoutes = require('./routes/authRoutes.js')
const roomRoutes = require('./routes/roomRoutes.js')
const reservationRoutes = require('./routes/reservarionRoutes.js')

//middleware
app.use(express.json())
app.use(cors())

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/rooms", roomRoutes)
app.use("/api/reservations", reservationRoutes)

const port = process.env.PORT

app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
