const express = require("express")
const Product = require("../models/Product")
const router = express.Router()
const jwt = require("jsonwebtoken")

require("dotenv").config

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


router.get("/products", verifyToken, async (req, res) => {
    try{
        const product = await Product.find()
        res.json(product)
    }catch(error){
        res.status(400).json(error)
    }
});

router.get("/products/:id", verifyToken, async(req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        res.json(product)
    }catch(error){
        res.status(400).json(error)
    }
})

// //Debug Tool
// router.get("/getAll", async(req, res) => {
//     try{
//         const product = await Product.find({})
//         res.json(product)
//     }catch(err){
//         res.status(400).json(err)
//     }
// })

module.exports = router