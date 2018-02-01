var express = require('express');
var router = express.Router();

var ctrlSpas = require('../controllers/spas.controllers.js');
var ctrlReviews = require('../controllers/reviews.controllers.js');

// Spa routes
router
  .route('/spas')
  .get(ctrlSpas.spasGetAll)
  .post(ctrlSpas.spasAddOne);

router
  .route('/spas/:spaId')
  .get(ctrlSpas.spasGetOne)
  .put(ctrlSpas.spasUpdateOne)
  .delete(ctrlSpas.spasDeleteOne);


// Review routes
router
  .route('/spas/:spaId/reviews')
  .get(ctrlReviews.reviewsGetAll)
  .post(ctrlReviews.reviewsAddOne);

router
  .route('/spas/:spaId/reviews/:reviewId')
  .get(ctrlReviews.reviewsGetOne)
  .put(ctrlReviews.reviewsUpdateOne)
  .delete(ctrlReviews.reviewsDeleteOne);

module.exports = router;