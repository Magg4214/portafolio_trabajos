import 'dotenv/config';
import 'reflect-metadata';
import { app } from './app';
import { AppDataSource } from './shared/data-source';

const PORT = Number(process.env.PORT || 3001);

async function shutdown(server?: import('http').Server) {
  try {
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  } catch {}
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  } catch {}
}

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    const server = app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend running on http://localhost:${PORT}`);
    });

    const onSignal = async (signal: NodeJS.Signals) => {
      // eslint-disable-next-line no-console
      console.log(`Received ${signal}. Shutting down gracefully...`);
      await shutdown(server);
      process.exit(0);
    };

    process.on('SIGTERM', onSignal);
    process.on('SIGINT', onSignal);
    process.on('unhandledRejection', (reason) => {
      // eslint-disable-next-line no-console
      console.error('Unhandled Rejection:', reason);
    });
    process.on('uncaughtException', async (err) => {
      // eslint-disable-next-line no-console
      console.error('Uncaught Exception:', err);
      await shutdown(server);
      process.exit(1);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start application', err);
    await shutdown();
    process.exit(1);
  }
}

bootstrap();
