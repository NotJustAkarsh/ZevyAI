import express from"express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import router from "./routes/agent.route.js"


dotenv.config()

const port=process.env.PORT

const app=express()

app.use(express.json())

app.use("/",router)



app.get("/",(req,res)=>{
    res.status(200).json({message: "Hello from Agent Service"})
})

app.listen(port,()=>{
    console.log(`Agent Service Started at ${port}`)
    connectDB()
})