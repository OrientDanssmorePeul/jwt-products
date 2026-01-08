const express = require('express')
const mongoose = require('mongoose')
const productRoutes = require("./routes/ProductRoute")
const userRoutes = require("./routes/UserRoute")

require("dotenv").config()

const app = express()
app.use(express.json())

const cors = require("cors");

const corsHandler = cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, PATCH",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    preflightContinue: false,
});

app.use(corsHandler)

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Express Server Started")
        })
    })
    .catch((err) => {
        console.log(err)
    })

app.use("/user", userRoutes)
app.use("/", productRoutes)
