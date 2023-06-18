const router = require("express").Router()
const path = require('path')
const Item = require('../models/item.js')
const fs = require('fs')
const db = require('../db.js')

router.post('/import', async (req, res) => {
    console.log(req.body.product)
    try {
        //DB isolation level REPEATABLE READ
        let session = db.startSession();
        (await session).startTransaction({ readConcern: { level: 'snapshot' } });
        const product = await Item.findOne({id: req.body.product}, '-_id -__v');
        (await session).commitTransaction();
        (await session).endSession()
        if(product){
            res.status(201).send(product)
        } else {
            res.status(500).send({message: "Nie ma produktu"})
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({message: "Error!"})
    }
})

router.post('/export', async (req, res) => {
    console.log(req.body.product)
    try {
        //DB isolation level REPEATABLE READ
        let session = db.startSession();
        (await session).startTransaction({ readConcern: { level: 'snapshot' } });
        const product = await Item.findOne({id: req.body.product.id})
        if(product){
            await Item.findOneAndUpdate({id: req.body.product.id})
            res.status(201).send({message: "Edytowano produkt"})
        } else {
            await new Item({...req.body.product}).save()
            res.status(201).send({message: "Dodano produkt"})
        }
        (await session).commitTransaction();
        (await session).endSession()
    } catch (e) {
        res.status(500).send({message: "Error!"})
    }
})

module.exports = router