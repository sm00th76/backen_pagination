require('dotenv').config({ path : ".env"})
const express = require('express')
const mongoose = require('mongoose')
const productRouter = require("./router/productRoutes");

const app = express()

app.use(express.json())

app.get('/',(req,res)=>{
	res.status(200).json({msg:{"status":"good"}})
})

app.use('/api/products',productRouter)

app.listen(process.env.PORT,(req,res)=>{
	console.log(`listening at ${process.env.PORT}`)
})

const connectDB = async() => {
	try{
		await mongoose.connect(process.env.MONGO_URI)
		console.log("DB connected")
	}catch(err){
		console.log(err)
	}
}

connectDB()