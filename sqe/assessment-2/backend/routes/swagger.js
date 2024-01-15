const express = require('express');
const swaggerUi = require('swagger-ui-express');

const { swaggerSpec } = require('../lib/swagger');

const router = module.exports = express.Router();

router.get('/swagger.json', (_req, res) => res.status(200).json(swaggerSpec));

router.get('*', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    queryConfigEnabled: false,
    defaultModelsExpandDepth: 0,
    supportedSubmitMethods: [],
  },
}));

module.exports = router;
