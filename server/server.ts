import config from "./../config/config";
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
})


