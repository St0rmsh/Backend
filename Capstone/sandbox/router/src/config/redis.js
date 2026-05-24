import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URI)

redis.on("connect", ()=>{
    console.log("Connected to Redis Successfully");
    
})

redis.on("error", (err)=>{
    console.error("Redis connection error " , err);
    
})


export async function refreshTTL(sandboxId) {
    
   return await redis.expire(`sandbox:${sandboxId}`, 120);
    

}