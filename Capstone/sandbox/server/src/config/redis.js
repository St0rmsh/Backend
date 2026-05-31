// import Redis from "ioredis"
// import { deletePod } from "../kubernetes/pod.js"
// import { deleteService } from "../kubernetes/service.js"

// const redis = new Redis(process.env.REDIS_URI)

// const subscriber = new Redis(process.env.REDIS_URI)

// export async function createSandboxKey(sandboxId){

//     await redis.set(`sandbox:${sandboxId}`,JSON.stringify({
//         status: "active"
//     }), "ex" , 2400 )   // 40 mins TTL
// }

// subscriber.config("SET" , "notify-keyspace-events" , "Ex")

// subscriber.subscribe("__keyevent@0__:expired")

// subscriber.on("message",async function(channel,key){
//     console.log("Expired key:",key);

//     const sandboxId = key.split(":")[1]

//     await deletePod(sandboxId)

//     await deleteService(sandboxId)
// })


import Redis from "ioredis"
import { deletePod } from "../kubernetes/pod.js"
import { deleteService } from "../kubernetes/service.js"

const redis = new Redis(process.env.REDIS_URI)
const subscriber = new Redis(process.env.REDIS_URI)

export async function createSandboxKey(sandboxId) {
    await redis.set(`sandbox:${sandboxId}`, JSON.stringify({
        status: "active"
    }), "EX", 2400)
}

async function setupExpiryListener() {
    await redis.config("SET", "notify-keyspace-events", "Ex")  // ← redis, not subscriber
    await subscriber.subscribe("__keyevent@0__:expired")

    subscriber.on("message", async (channel, key) => {
        if (!key.startsWith("sandbox:")) return  // ← ignore unrelated keys

        console.log("Expired key:", key)
        const sandboxId = key.split(":")[1]

        try {
            await deletePod(sandboxId)
            await deleteService(sandboxId)
            console.log(`Cleaned up sandbox: ${sandboxId}`)
        } catch (err) {
            console.error(`Cleanup failed for ${sandboxId}:`, err.message)
        }
    })
}

setupExpiryListener()