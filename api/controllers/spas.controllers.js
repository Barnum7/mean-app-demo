var mongoose = require('mongoose');
var Spa = mongoose.model('Spa');

module.exports.spasGetAll = function(req, res) {

  console.log('GET the spas');
  console.log(req.query);

  var offset = 0;
  var count = 5;
  var maxCount = 50;

  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }

  if (req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }

  if (isNaN(offset) || isNaN(count)) {
    res
      .status(400)
      .json({
        "message" : "If supplied in querystring, count and offset must both be numbers"
      });
    return;
  }

  if (count > maxCount) {
    res
      .status(400)
      .json({
        "message" : "Count limit of " + maxCount + " exceeded"
      });
    return;
  }

  Spa
    .find()
    .skip(offset)
    .limit(count)
    .exec(function(err, spas) {
      console.log(err);
      console.log(spas);
      if (err) {
        console.log("Error finding spas");
        res
          .status(500)
          .json(err);
      } else {
        console.log("Found spas", spas.length);
        res
          .json(spas);
      }
    });

};

module.exports.spasGetOne = function(req, res) {
  var id = req.params.spaId;

  console.log('GET spaId', id);

  Spa
    .findById(id)
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
      res
        .status(response.status)
        .json(response.message);
    });

};

var _splitArray = function(input) {
  var output;
  if (input && input.length > 0) {
    output = input.split(";");
  } else {
    output = [];
  }
  return output;
};

module.exports.spasAddOne = function(req, res) {
  console.log("POST new spa");

  Spa
    .create({
      name : req.body.name,
      description : req.body.description,
      stars : parseInt(req.body.stars,10),
      services : _splitArray(req.body.services),
      photos : _splitArray(req.body.photos),
      currency : req.body.currency,
      location : {
        address : req.body.address
      }
    }, function(err, spa) {
      if (err) {
        console.log("Error creating spa");
        res
          .status(400)
          .json(err);
      } else {
        console.log("Spa created!", spa);
        res
          .status(201)
          .json(spa);
      }
    });
};


module.exports.spasUpdateOne = function(req, res) {
  var spaId = req.params.spaId;

  console.log('GET spaId', spaId);

  Spa
    .findById(spaId)
    .select('-reviews -services')
    .exec(function(err, spa) {
      if (err) {
        console.log("Error finding spa");
        res
          .status(500)
          .json(err);
          return;
      } else if(!spa) {
        console.log("SpaId not found in database", spaId);
        res
          .status(404)
          .lson({
            "message" : "Spa ID not found " + spaId
          });
          return;
      }

      spa.name = req.body.name;
      spa.description = req.body.description;
      spa.stars = parseInt(req.body.stars,10);
      spa.services = _splitArray(req.body.services);
      spa.photos = _splitArray(req.body.photos);
      spa.currency = req.body.currency;
      spa.location = {
        address : req.body.address
      };

      spa
        .save(function(err, spaUpdated) {
          if(err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
    });
};


module.exports.spasDeleteOne = function(req, res) {
  var spaId = req.params.spaId;

  Spa
    .findByIdAndRemove(spaId)
    .exec(function(err, location) {
      if (err) {
        res
          .status(404)
          .json(err);
      } else {
        console.log("Spa deleted, id:", spaId);
        res
          .status(204)
          .json();        
      }
    });
};
