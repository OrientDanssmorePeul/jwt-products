const express = require('express')
const mongoose = require('mongoose')
const productRoutes = require("./routes/ProductRoute")
const userRoutes = require("./routes/UserRoute")

const app = express()
app.use(express.json())

const cors = require("cors");

const corsHandler = cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    preflightContinue: false,
});

app.use(corsHandler)

mongoose
    .connect('mongodb://localhost:27017/jwt_with_products')
    .then(() => {
        app.listen(3000, () => {
            console.log("Express Server Started")
        })
    })
    .catch((err) => {
        console.log(err)
    })

app.use("/user", userRoutes)
app.use("/", productRoutes)
