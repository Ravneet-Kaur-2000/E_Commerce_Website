const express = require('express');
const path =require('path');
const { postDeleteProducts } = require('../controllers/admin');

const router = express.Router();

const shopControllers= require('../controllers/shop');
const isAuth=require('../middleware/is-auth');

router.get('/',shopControllers.getIndex);
router.get('/cart',isAuth,shopControllers.getCart);
router.post('/cart',isAuth,shopControllers.postCart);
router.get('/products',shopControllers.getProducts);
router.get('/products/:productId',shopControllers.getProduct);
router.post('/cart-delete-item',isAuth,shopControllers.postCartDeleteProducts);
router.get('/orders',isAuth,shopControllers.getOrders);
router.post('/create-order',isAuth,shopControllers.postOrder)
router.get('/orders/:orderId',isAuth,shopControllers.getInvoice)

module.exports=router;