var express = require('express');
var router = express.Router();

var ctrlSpas = require('../controllers/spas.controllers.js');

router
  .route('/spas')
  .get(ctrlSpas.spasGetAll);

router
  .route('/spas/:spaId')
  .get(ctrlSpas.spasGetOne);

router
  .route('/spas/new')
  .post(ctrlSpas.spasAddOne);

module.exports = router;