const { startServer, stopServer } = require('../server.js');

let server;

// Before all tests start
beforeAll(async () => {
    server = startServer();
});

// Increase timeout for all tests
jest.setTimeout(15000);

// Global error handler for unhandled promises
process.on('unhandledRejection', (err) => {
    console.error('Unhandled promise rejection:', err);
});

// Clean up server after tests
afterAll(async () => {
    await stopServer();
}); 