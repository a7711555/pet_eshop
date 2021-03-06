const express = require('express');
const router = express.Router();
const getIndex = require('../contorllers/index/getIndex_controller');
const registerController = require('../contorllers/index/register_controller');
const loginController = require('../contorllers/index/login_controller');
const logoutController = require('../contorllers/index/logout_controller');

/* GET home page. */ 
router.get('/', getIndex);

// register router
const register = new registerController(); 
router.get('/register', register.registerPage);
router.post('/register/post', register.poster);

router.get('/login', function (req, res) {
  res.render('login', {
    msg: req.flash('error'),
  });
});
router.post('/login/verify', loginController);

router.get('/logout', logoutController);

router.get('/cart', function (req, res) {
  res.render('cart');
});


module.exports = router;
