const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');

const apiRouter = require('./backend/api');
const webRouter = require('./frontend/server');

const app = module.exports = express();

app.set('env', ['production', 'staging'].includes(process.env.NODE_ENV ?? ''));
app.disable('trust proxy');
app.disable('x-powered-by');

app.use(morgan('tiny', {
  skip: process.env.NODE_ENV === 'testing' ? () => true : undefined,
}));

app.use('/api', [
  bodyParser.json({ strict: true }),
  apiRouter,
]);
app.get('*', webRouter);
