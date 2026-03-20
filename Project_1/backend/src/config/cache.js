import Redis from "ioredis";
import config from "./config.js";


const redis = new Redis({
    host:config.REDIS_HOST,
    port:config.REDIS_PORT,
    password:config.REDIS_PASSWORD
})


redis.on("connect",()=>{
    console.log("Connected to Redis");
    
})
redis.on("error",(error)=>{
    console.error("Error "+error);
    process.exit(1)
    
})


export default redis