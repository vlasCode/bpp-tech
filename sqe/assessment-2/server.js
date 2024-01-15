const http = require('http');

const app = require('./app');
const logger = require('./backend/lib/logger');

const server = http.createServer(app);

server.listen(3000, 'localhost', () => logger.info('Server listening on http://localhost:3000'));
