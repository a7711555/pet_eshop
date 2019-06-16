const express = require('express');
const router = express.Router();
const Checkout = require('../contorllers/user/order_contorllers');

router.get('/', function (req, res, next) {
  res.render('user');
});

const checkout = new Checkout();
router.get('/checkout', checkout.checkout);

// area infomation api
router.post('/checkout/data/:city', checkout.getAreaInfo);

// get user info
router.post('/checkout/details', checkout.details);

module.exports = router;
