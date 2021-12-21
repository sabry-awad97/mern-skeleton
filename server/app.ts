import express from "express";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
const app = express();

/*
 * Request body-parsing middleware to handle the
 * complexities of parsing streamable request objects so that we can simplify
 * browser-server communication by exchanging JSON in the request body.
 * *** parse body params and attache them to req.body ***
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
 * Cookie parsing middleware to parse and set cookies in request objects.
 */
app.use(cookieParser());

/*
 * Compression middleware that will attempt to compress
 * response bodies for all requests that traverse through the middleware.
 */
app.use(compress());

/*
 * Collection of middleware functions to help secure Express apps by
 * setting various HTTP headers.
 */
app.use(helmet());

/*
 * Middleware to enable cross-origin resource sharing (CORS).
 */
app.use(cors());

export default app;
