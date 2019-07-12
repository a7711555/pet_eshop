const express = require('express');
const router = express.Router();
const userControllerClass = require('../contorllers/user/user_controller');
const Checkout = require('../contorllers/user/order_contorllers');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true })

const userController = new userControllerClass();
router.get('/',csrfProtection, userController.userPage);

router.post('/getOrderInfo/:orderId', userController.getOrderInfo);
router.post('/updatePassword', csrfProtection, userController.updatePassword);

const checkout = new Checkout();

router.get('/checkout', csrfProtection, checkout.checkout);

// get user info
router.post('/checkout/details', csrfProtection, checkout.details);

module.exports = router;
