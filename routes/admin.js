const express = require('express');
const path= require('path');

const router = express.Router();

const adminControllers= require('../controllers/admin');

router.get('/add-product',adminControllers.addProduct);
router.get('/products',adminControllers.getAdminProducts);
router.post('/add-product',adminControllers.postAddProducts);
router.get("/edit-product/:productId",adminControllers.getEditProduct);
router.post("/edit-product",adminControllers.postEditProducts);
router.post("/delete-product",adminControllers.postDeleteProducts); 
module.exports=router;
