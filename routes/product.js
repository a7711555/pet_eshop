const express = require('express');
const router = express.Router();
const GetProducts = require('../contorllers/product/getProduct_controller');

getProducts = new GetProducts;
router.get('/', getProducts.defaultPage);

router.get('/:category', getProducts.CategoryPage);

module.exports = router;