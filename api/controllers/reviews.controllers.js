var mongoose = require('mongoose');
var Spa = mongoose.model('Spa');


// GET all reviews for a spa
module.exports.reviewsGetAll = function(req, res) {
  var id = req.params.spaId;
  console.log('GET reviews for spaId', id);

  Spa
    .findById(id)
    .select('reviews')
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : []
      };
      if (err) {
        console.log("Error finding spa");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("Spa id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Spa ID not found " + id
        };
      } else {
        response.message = doc.reviews ? doc.reviews : [];
      }
      res
        .status(response.status)
        .json(response.message);
    });
};

// GET single review for a spa
module.exports.reviewsGetOne = function(req, res) {
  var spaId = req.params.spaId;
  var reviewId = req.params.reviewId;
  console.log('GET reviewId ' + reviewId + ' for spaId ' + spaId);

  Spa
    .findById(spaId)
    .select('reviews')
    .exec(function(err, spa) {
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding spa");
        response.status = 500;
        response.message = err;
      } else if(!spa) {
        console.log("Spa id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Spa ID not found " + id
        };
      } else {
        // Get the review
        response.message = spa.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!response.message) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      res
        .status(response.status)
        .json(response.message);
    });

};

var _addReview = function (req, res, spa) {
  
  spa.reviews.push({
    name : req.body.name,
    rating : parseInt(req.body.rating, 10),
    review : req.body.review
  });

  spa.save(function(err, spaUpdated) {
    if (err) {
      res
        .status(500)
        .json(err);
    } else {
      res
        .status(200)
        .json(spaUpdated.reviews[spaUpdated.reviews.length - 1]);
    }
  });

};

module.exports.reviewsAddOne = function(req, res) {

  var id = req.params.spaId;

  console.log('POST review to spaId', id);

  Spa
    .findById(id)
    .select('reviews')
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : doc
      };
      if (err) {
        console.log("Error finding spa");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        console.log("SpaId not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Spa ID not found " + id
        };
      }
      if (doc) {
        _addReview(req, res, doc);
      } else {
        res
          .status(response.status)
          .json(response.message);
      }
    });
};


module.exports.reviewsUpdateOne = function(req, res) {
  var spaId = req.params.spaId;
  var reviewId = req.params.reviewId;
  console.log('PUT reviewId ' + reviewId + ' for spaId ' + spaId);

  Spa
    .findById(spaId)
    .select('reviews')
    .exec(function(err, spa) {
      var thisReview;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding spa");
        response.status = 500;
        response.message = err;
      } else if(!spa) {
        console.log("Spa id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Spa ID not found " + id
        };
      } else {
        // Get the review
        thisReview = spa.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        thisReview.name = req.body.name;
        thisReview.rating = parseInt(req.body.rating, 10);
        thisReview.review = req.body.review;
        spa.save(function(err, spaUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });
};


module.exports.reviewsDeleteOne = function(req, res) {
  var spaId = req.params.spaId;
  var reviewId = req.params.reviewId;
  console.log('PUT reviewId ' + reviewId + ' for spaId ' + spaId);

  Spa
    .findById(spaId)
    .select('reviews')
    .exec(function(err, spa) {
      var thisReview;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding spa");
        response.status = 500;
        response.message = err;
      } else if(!spa) {
        console.log("Spa id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Spa ID not found " + id
        };
      } else {
        // Get the review
        thisReview = spa.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        spa.reviews.id(reviewId).remove();
        spa.save(function(err, spaUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });
};