import config from "../config/config";
import app from "./app";

import mongoose from "mongoose";
const { port, mongoUri } = config;

mongoose.connect(mongoUri);
mongoose.connection.on("error", () => {
    throw new Error(`unable to connect to database: ${mongoUri}`);
});

const server = app.listen(port);

server.on("listening", () => {
    console.info(`Server is running at http://localhost:${port}`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
    // EADDRINUSE => when another server is already
    // listening on the requested port

    // cmd => taskkill /F /IM node.exe
    if (err.code === "EADDRINUSE") {
        console.warn("Address already in use, retrying...");
        setTimeout(() => {
            server.close();
            server.listen(port);
        }, 1000);
    } else {
        console.error(err);
    }
});
