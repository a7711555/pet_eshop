const express = require('express');
const router = express.Router();
const area_data = require('../models/area_data');

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/checkout', function (req, res) {
  res.render('checkout');
});

// area infomation api
router.post('/checkout/data/:city', function (req, res) {
  const city = req.param('city');
  const citydecode = decodeURI(Buffer.from(city, 'base64').toString('utf8'));  
  res.send({
    sccuess: true,
    data: area_data[citydecode],
  });
  res.end();
});

// get user info
router.post('/checkout/confirm', function(req, res){
  res.render('confirm');
});

module.exports = router;
