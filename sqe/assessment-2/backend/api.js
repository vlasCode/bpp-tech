const _ = require('lodash');
const assert = require('http-assert-plus');
const crypto = require('crypto');
const express = require('express');

const logger = require('./lib/logger');
const listsRouter = require('./routes/lists');
const tasksRouter = require('./routes/tasks');
const swaggerRouter = require('./routes/swagger');

const api = module.exports = express.Router();

api.use((req, res, next) => {
  const id = crypto.randomUUID();
  req.log = logger.child({ req_id: id });
  res.set('X-Request-ID', id);
  res.on('finish', () => req.log.info({ req, res }));
  next();
});

api.use('/docs', swaggerRouter);
api.use('/lists', listsRouter);
api.use('/tasks', tasksRouter);

api.get('*', (req) => assert.fail(404, 'Resource not found', {
  code: 'RESOURCE_NOT_FOUND',
  meta: { url: req.originalUrl },
}));

api.use((err, req, res, _next) => {
  req.log.error({ req, err });

  const error = {
    name: err.name,
    message: err.userMessage ?? err.message ?? err.toString().split('\n').shift(),
    code: err.code,
    status: err.statusCode ?? err.status ?? undefined,
    meta: _.isPlainObject(err.meta) ? err.meta : undefined,
  };

  res.status(error.status ?? 500).json({ error });
});
