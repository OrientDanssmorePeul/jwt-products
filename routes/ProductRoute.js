const express = require("express")
const Product = require("../models/Product")
const router = express.Router()
const jwt = require("jsonwebtoken")


function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(" ")[1];

    jwt.verify(token, "55a9a79d0c9ec7b03762d5a9e3d67cc700a719d826e4e2f87fcf361ec75e2454", (err, user) => {
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