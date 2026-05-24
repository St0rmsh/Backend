import app, { previewProxy, agentProxy } from "./src/app.js";

const PORT = 3000

const server = app.listen(PORT, () => {
    console.log(`Router is running on port ${PORT}`)
})

server.on("upgrade", (req, socket, head) => {
    const host = req.headers.host;
    if (!host) {
        socket.destroy();
        return;
    }

    const parts = host.split(".");
    const subdomain = parts[1];

    if (subdomain === "agent") {
        agentProxy.upgrade(req, socket, head);
    } else if (subdomain === "preview") {
        previewProxy.upgrade(req, socket, head);
    } else {
        socket.destroy();
    }
});