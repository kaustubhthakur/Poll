const cookieParser = require('cookie-parser');
const express = require('express')
const app = express();
const port = 9000
const mongoose = require('mongoose')
require('dotenv').config();
const authrouter = require('./routes/auth')
const userrouter = require('./routes/users')
const cors = require('cors')

app.use(cookieParser())
app.use(express.json())
app.use(cors())

const connection = async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log('db is connected...')
    } catch (error) {
        console.error(error)
    }
}
connection();
app.use('/auth',authrouter)
app.use('/users',userrouter)
app.listen(port,() =>{
    console.log(`server is running on port ${port}...`)
})