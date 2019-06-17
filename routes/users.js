const express = require('express');
const router = express.Router();
const userControllerClass = require('../contorllers/user/user_controller');
const Checkout = require('../contorllers/user/order_contorllers');

const userController = new userControllerClass();
router.get('/', userController.userPage);

router.post('/getOrderInfo/:orderId', userController.getOrderInfo);
router.post('/updatePassword', userController.updatePassword);

const checkout = new Checkout();

router.get('/checkout', checkout.checkout);
// area infomation api
router.post('/checkout/data/:city', checkout.getAreaInfo);

// get user info
router.post('/checkout/details', checkout.details);

module.exports = router;
