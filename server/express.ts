import express, { Request, Response, NextFunction } from 'express';
import path from 'path';

/*... configure express ... */

/*  Cookie parsing middleware to parse and set cookies in request objects.  */
import cookieParser from 'cookie-parser';

/* Compression middleware that will attempt to compress 
  response bodies for all requests that traverse through the middleware. 
*/
import compress from 'compression';

/* Middleware to enable cross-origin resource sharing (CORS) */
import cors from 'cors';

/* Collection of middleware functions to help secure 
  Express apps by setting various HTTP headers. 
*/
import helmet from 'helmet';

// import Template from "../../template";
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

export const app = express();

// Serve app production bundle
app.use(express.static('dist/app'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use('/', userRoutes);
app.use('/', authRoutes);

// Handle client routing, return all requests to the app
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'app/index.html'));
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.name + ': ' + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ': ' + err.message });
    console.log(err);
  }
});
