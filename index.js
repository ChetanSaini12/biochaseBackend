const express = require('express')
const app = express()
const router = express.Router()
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require("dotenv");
dotenv.config();


app.use(express.json())
app.use(cors({origin: true, credentials: true}))


/**************ROUTES*****************/
app.use('/', router)
const auth = require('./routes/auth')
router.use("/auth", auth)


/***********SERVER Start**************/
const port = process.env.PORT 
app.listen(port, (() => {
    console.log("Server is http://localhost:7000")
}))

/************MONGODB Connect**********/
const MONGO_URI = process.env.MONGO_STRING
mongoose.connect(MONGO_URI)
.then(() => {
    console.log("MONGODB Connected")
})
.catch((err) => {
    console.log(err);
})

