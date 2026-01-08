const express = require("express")
const Product = require("../models/Product")
const router = express.Router()
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");

require("dotenv").config()

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

router.post("/", verifyToken, async (req, res) => {
    try{
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            inStock: req.body.inStock,
            imageUrl: req.body.imageUrl
        });
        await product.save();
        const allProducts = await Product.find();

        res.status(201).json(allProducts);
    }catch(error){
        res.status(400).json(error)
    }
})

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

router.patch("/products/:id", verifyToken, async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body, 
            {new: true, runValidators: true}
        )
        if(!product){
            return res.status(404).json({ message: "Product not found" }); 
        }
        const allProducts = await Product.find();

        res.status(201).json(allProducts);
    }catch(error){
        res.status(400).json(error)
    }
})

router.delete("/products/:id", verifyToken, async(req, res)=>{
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if(!product){
            return res.status(404).json({ message: "Failed to delete (It might be that product does not exist)" }); 
        }else{
            return res.status(200).json({ message: "Product deleted success" , deletedData: product})            
        }
    } catch (error) {
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