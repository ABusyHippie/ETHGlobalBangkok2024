const app = require('./index.js');
const port = process.env.PORT || 3000;

let server;

function startServer() {
    server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    return server;
}

function stopServer() {
    return new Promise((resolve) => {
        if (server) {
            server.close(resolve);
        } else {
            resolve();
        }
    });
}

module.exports = { startServer, stopServer }; 