var spaData = require('../data/spa-data.json');

module.exports.spasGetAll = function(req, res) {

  console.log('GET the spas');
  console.log(req.query);

  var returnData;
  var offset = 0;
  var count = 5;

  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }
  
  if (req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }

  returnData = spaData.slice(offset,offset+count);

  res
    .status(200)
    .json(returnData);
};

module.exports.spasGetOne = function(req, res) {
  console.log('GET spaId', req.params.spaId);
  res
    .status(200)
    .json(spaData[req.params.spaId]);
};

module.exports.spasAddOne = function(req, res) {
  console.log("POST new spa");
  console.log(req.body);
  res
    .status(200)
    .json(req.body);
};