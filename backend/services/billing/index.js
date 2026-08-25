import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import router from "./routes/billing.route.js";

const port = process.env.PORT;

const app = express();
app.use(express.json())
app.use("/",router)
app.get("/",(req,res)=>{
    res.json({message:"Hello from Billing"})
})

app.listen(port,()=>{
    console.log(`Billing Service started at ${port}`)
    connectDb()
})
