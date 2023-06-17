const router = require("express").Router()
const path = require('path')
const Item = require('../models/item.js')
const fs = require('fs')

router.post('/import', async (req, res) => {
    console.log(req.body.product)
    try {
        const product = await Item.findOne({id: req.body.product}, '-_id')
        if(product){
            res.status(201).send(product)
        } else {
            res.status(500).send({message: "Nie ma produktu"})
        }
    } catch (e) {
        res.status(500).send({message: "Error!"})
    }
})

router.post('/export', async (req, res) => {
    console.log(req.body.product)
    try {
        const product = await Item.findOne({id: req.body.product.id})
        if(product){
            await Item.findOneAndUpdate({id: req.body.product.id})
            res.status(201).send({message: "Edytowano produkt"})
        } else {
            await new Item({...req.body.product}).save()
            res.status(201).send({message: "Dodano produkt"})
        }
    } catch (e) {
        res.status(500).send({message: "Error!"})
    }
})

module.exports = router