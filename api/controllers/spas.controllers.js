var dbconn = require('../data/dbconnection.js');
var ObjectId = require('mongodb').ObjectID;

var spaData = require('../data/spa-data.json');

module.exports.spasGetAll = function(req, res) {

  var db = dbconn.get();

  console.log('GET the spas');
  console.log(req.query);

  var offset = 0;
  var count = 5;

  var collection = db.collection('spas');

  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }
  
  if (req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }

  collection
    .find()
    .skip(offset)
    .limit(count)
    .toArray(function(err, docs) {
      console.log("Found spas", docs.length);
      res
        .status(200)
        .json(docs);
  });

};

module.exports.spasGetOne = function(req, res) {
  var db = dbconn.get();
  var id = req.params.spaId;
  var collection = db.collection('spas');
  console.log('GET spaId', id);

  collection
    .findOne({
      _id : ObjectId(id)
    }, function(err, doc) {
      res
        .status(200)
        .json(doc);
  });

};

module.exports.spasAddOne = function(req, res) {
  console.log("POST new spa");
  var db = dbconn.get();
  var collection = db.collection('spas');
  var newSpa;

  if (req.body && req.body.name && req.body.stars) {
    newSpa = req.body;
    newSpa.stars = parseInt(req.body.stars, 10);
    collection.insertOne(newSpa, function(err, response) {
      console.log("Spa added", response, response.ops);
      res
        .status(201)
        .json(response.ops);
    });
  } else {
    console.log("Data missing from body");
    res
      .status(400)
      .json({ message : "Required data missing from body" });
  }

};