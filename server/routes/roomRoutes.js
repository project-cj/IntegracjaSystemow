const router = require("express").Router()
const path = require('path')
const Room = require("../models/room.js")

router.get("/", async (req, res) => {
    try {
        const rooms = await Room.find({}, '-_id -__v')
        res.status(201).send({rooms: rooms})
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
})
module.exports = router