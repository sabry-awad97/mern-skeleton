import mongoose from 'mongoose';

import { app } from './express';
import { config } from '../config';

const { mongoUri, port } = config;

mongoose.Promise = global.Promise;

const startServer = () => {
  const server = app.listen(port);

  server.on('listening', () => {
    console.info(`Server is running at http://localhost:${port}`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    // EADDRINUSE => when another server is already
    // listening on the requested port

    // cmd => taskkill /F /IM node.exe
    if (err.code === 'EADDRINUSE') {
      console.warn('Address already in use, retrying...');
      setTimeout(() => {
        server.close();
        server.listen(port);
      }, 1000);
    } else {
      console.error(err);
    }
  });
};

async function main() {
  try {
    await mongoose.connect(mongoUri);
    startServer();
  } catch (err) {
    console.log(err);
  }
}

main();
