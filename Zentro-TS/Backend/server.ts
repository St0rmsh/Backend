import app from "./src/app.js"
import { config } from "./src/config/config.js"
import connectDB from "./src/config/db.js"
import dns from "dns"

dns.setServers(["8.8.8.8", "1.1.1.1"])

type ServerState = 
    | "booting"
    | "connecting-db"
    | "starting-server"
    | "running"
    | "stopped"
    | "error"


let serverState: ServerState = "booting"


const startServer = async (): Promise<void> => {
    try {
        serverState = "connecting-db"
        await connectDB()
        serverState = "starting-server"

        app.listen(config.PORT, () => {
            serverState = "running"
            console.log(`Server is running on port ${config.PORT}`)
        })

    } catch (error) {
        console.error("Server start error:", error)
        serverState = "error"
        process.exit(1)
    }
}

startServer()