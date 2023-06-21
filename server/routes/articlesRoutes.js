const router = require("express").Router()
const db = require('../db.js')
const Article = require('../models/article.js')

router.post('/import', async (req, res) => {
    try {
        //DB isolation level REPEATABLE READ
        let session = db.startSession();
        (await session).startTransaction({ readConcern: { level: 'snapshot' } });
        const articles = await Article.find();
        (await session).commitTransaction();
        (await session).endSession()
        if(articles){
            res.status(201).send(articles)
        } else {
            res.status(500).send({message: "Brak artykułów"})
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({message: "Error!"})
    }
})

module.exports = router

