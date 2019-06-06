const express = require('express');
const router = express.Router();
const getIndex = require('../contorllers/index/getIndex_controller');


/* GET home page. */
router.get('/', getIndex);

router.get('/register', function (req, res) {
  res.render('register');
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.get('/cart',function(req, res) {
  res.render('cart');
});


module.exports = router;
