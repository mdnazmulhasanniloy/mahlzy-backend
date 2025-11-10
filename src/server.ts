import { createServer, Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import initializeSocketIO from './socket';
import { defaultTask } from './app/utils/defaultTask';
import colors from 'colors';
import cluster from 'cluster';
import os from 'os';

let server: Server;
const numCPUs = os.cpus().length;

export const io = initializeSocketIO(createServer(app));

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`.blue.bold);
  console.log(`Starting ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`.red.bold);
    cluster.fork();
  });
} else {
  async function main() {
    try {
      await mongoose.connect(config.database_url as string);
      defaultTask();
      server = app.listen(Number(config.port), config.ip as string, () => {
        console.log(
          colors.italic.green.bold(
            `💫 Simple Server Listening on  http://${config?.ip}:${config.port} `,
          ),
        );
      });

      io.listen(Number(config.socket_port));
      console.log(
        colors.yellow.bold(
          `⚡Socket.io running on  http://${config.ip}:${config.socket_port}`,
        ),
      );
      console.log(new Date());
      //@ts-ignore
      global.socketio = io;
    } catch (err) {
      console.error(err);
    }
  }
  main();
  process.on('unhandledRejection', err => {
    console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    }
    process.exit(1);
  });

  process.on('uncaughtException', () => {
    console.log(`😈 uncaughtException is detected , shutting down ...`);
    process.exit(1);
  });
}
