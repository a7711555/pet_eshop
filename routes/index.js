const express = require('express');
const router = express.Router();
const fireDb = require('../models/firebaseAdmin');

/* GET home page. */
router.get('/', function (req, res, next) {
  
  fireDb.ref('products').once('value').then((snap) => {
    let data = [];
    snap.forEach((item) => {
      data.push(item.val());
    });
    let i, j, temp;
    for (i = data.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = data[i];
      data[i] = data[j];
      data[j] = temp;
    }
    res.render('index', {
      indexItem: data.slice(0, 3)
    });
  });  
});

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
