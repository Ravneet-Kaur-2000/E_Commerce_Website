const express = require('express');
const path= require('path');

const router = express.Router();

const adminControllers= require('../controllers/admin');
const isAuth=require('../middleware/is-auth');

router.get('/add-product',isAuth,adminControllers.addProduct);
router.get('/products',isAuth,adminControllers.getAdminProducts);
router.post('/add-product',isAuth,adminControllers.postAddProducts);
router.get("/edit-product/:productId",isAuth,adminControllers.getEditProduct);
router.post("/edit-product",isAuth,adminControllers.postEditProducts);
router.post("/delete-product",isAuth,adminControllers.postDeleteProducts); 
module.exports=router;
