const router = require("express").Router()
const path = require('path')
const Room = require("../models/room.js")
const Reservation = require("../models/reservation.js")

router.post("/", async (req, res) => {
    try {
        const mail = req.body.email
        const reservations = await Reservation.find({userMail: mail}, '-__v')
        res.status(201).send({reservations: reservations})
        //await new Reservation({userMail: "user2@gmail.com", roomName: "Pokoj 2", dateStart: "2023-06-02T00:00:00Z", dateEnd: "2023-06-05T00:00:00Z"}).save()
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
})
router.post("/delete", async (req, res) => {
    try{
        console.log("delete reservation")
        const id = req.body.id
        await Reservation.findByIdAndRemove(id)
    } catch (error){
        console.log(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
})
router.post("/save", async (req, res) => {
    try{
        console.log("edit reservation")
        const id = req.body.id
        const dateStart = req.body.dateStart
        const dateEnd = req.body.dateEnd
        const roomName = req.body.roomName
        let error = 0
        if(dateEnd<=dateStart)
        {
            res.status(409).send({message: "Nie można zapisać rezerwacji, początek nie może być po końcu!"})
        } else {
            const reserved = await Reservation.find({
                $or: [
                    { 'dateStart': { $lte: dateStart }, 'dateEnd': { $gte: dateStart } },
                    { 'dateStart': { $lt: dateEnd }, 'dateEnd': { $gte: dateEnd } },
                    { 'dateStart': { $gte: dateStart, $lte: dateEnd }}
                ]
            })
            console.log(reserved)
            let reserved2 = reserved.filter(obj => !obj._id.equals(id)).filter(obj => obj.roomName == roomName)
            console.log(reserved2)
            
            if(reserved2.length==0 && error == 0){
                await Reservation.findByIdAndUpdate(id, {dateStart: dateStart, dateEnd: dateEnd})
                res.status(201).send({message: "Rezerwacja zapisana!"})
            } else {
                res.status(409).send({message: "Nie można zapisać rezerwacji, koliduje z innymi!"})
            }
            console.log(id, dateStart, dateEnd, roomName)
        }
    } catch (error){
        console.log(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
})
router.post("/add", async (req, res) => {
    try{
        const dateStart = req.body.dateStart
        const dateEnd = req.body.dateEnd
        const roomName = req.body.roomName
        const mail = req.body.mail
        console.log(roomName, dateStart)
        if(dateEnd<=dateStart)
            res.status(409).send({message: "Nie można zapisać rezerwacji, początek nie może być po końcu!"})
        else {
            const reserved = await Reservation.find({
                $or: [
                    { 'dateStart': { $lte: dateStart }, 'dateEnd': { $gte: dateStart } },
                    { 'dateStart': { $lt: dateEnd }, 'dateEnd': { $gte: dateEnd } },
                    { 'dateStart': { $gte: dateStart, $lte: dateEnd }}
                ]
            })
            console.log(reserved)
            let reserved2 = reserved.filter(obj => obj.roomName == roomName)
            console.log(reserved2)
            if(reserved2.length==0){
                await new Reservation({userMail: mail, roomName: roomName, dateStart: dateStart, dateEnd: dateEnd}).save()
                res.status(201).send({message: "Rezerwacja zapisana!"})
            } else {
                res.status(409).send({message: "Nie można zapisać rezerwacji, koliduje z innymi!"})
            }
        }
    } catch (error){
        console.log(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
})
module.exports = router