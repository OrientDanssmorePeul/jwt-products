const express = require("express")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const router = express.Router()

router.post("/register", async (req, res) => {
    try {
        const hashed = await bcrypt.hash(req.body.password, 10);
        const user = new User({ email: req.body.email, password: hashed });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/getAllUserDetails", async(req, res) => {
    try{
        const users = await User.find({})
        res.json(users)
    }catch(err){
        res.status(400).json(err)
    }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if(!isMatch)
        return res.status(401).send("Invalid Credentials")
    else {
        const token = jwt.sign({ id: user._id }, "55a9a79d0c9ec7b03762d5a9e3d67cc700a719d826e4e2f87fcf361ec75e2454", { expiresIn: "1h" })
        res.json({token})
    } 

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router