const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJsDoc({
  swaggerDefinition: {
    info: {
      openapi: '3.0.3',
      title: 'Todo App API documentation',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
    tags: [
      { name: 'Lists' },
      { name: 'Tasks' },
    ],
  },
  apis: [
    path.resolve(__dirname, '../routes/*.js'),
  ],
});

module.exports = {
  swaggerSpec,
};
