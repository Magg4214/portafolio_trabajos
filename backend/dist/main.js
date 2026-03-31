"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const app_1 = require("./app");
const data_source_1 = require("./shared/data-source");
const PORT = Number(process.env.PORT || 3001);
async function shutdown(server) {
    try {
        if (server) {
            await new Promise((resolve) => server.close(() => resolve()));
        }
    }
    catch { }
    try {
        if (data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.destroy();
        }
    }
    catch { }
}
async function bootstrap() {
    try {
        await data_source_1.AppDataSource.initialize();
        const server = app_1.app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`Backend running on http://localhost:${PORT}`);
        });
        const onSignal = async (signal) => {
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
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to start application', err);
        await shutdown();
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map