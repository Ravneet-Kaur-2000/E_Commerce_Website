const express = require('express');
const path =require('path');
const { postDeleteProducts } = require('../controllers/admin');

const router = express.Router();

const shopControllers= require('../controllers/shop');

router.get('/',shopControllers.getIndex);
router.get('/cart',shopControllers.getCart);
router.post('/cart',shopControllers.postCart);
router.get('/products',shopControllers.getProducts);
router.get('/products/:productId',shopControllers.getProduct);
router.post('/cart-delete-item',shopControllers.postCartDeleteProducts);
router.get('/orders',shopControllers.getOrders);
router.post('/create-order',shopControllers.postOrder)

module.exports=router;