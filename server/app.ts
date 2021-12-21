import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

import userRoutes from "./routes/user.routes";

const app = express();

// http.IncomingMessage.prototype.isPrototypeOf(request) === true
// http.ServerResponse.prototype.isPrototypeOf(response) === true

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use("/", userRoutes);

// Catch unauthorised errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ error: err.name + ": " + err.message });
    } else if (err) {
        res.status(400).json({ error: err.name + ": " + err.message });
        console.log(err);
    }
});

export default app;
