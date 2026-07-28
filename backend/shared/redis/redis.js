import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL)

redis.on("connect",()=>{
    console.log("Connected to redis")
})

export default redis