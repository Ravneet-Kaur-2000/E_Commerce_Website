const express = require('express');
const path= require('path');
const {check,body}=require('express-validator')

const router = express.Router();

const adminControllers= require('../controllers/admin');
const isAuth=require('../middleware/is-auth');

router.get('/add-product',isAuth,adminControllers.addProduct);

router.get('/products',isAuth,adminControllers.getAdminProducts);

router.post('/add-product',[
    body('Title').isString().isLength({min:3}).trim(),
    body('imageUrl'),
    body('price').isFloat(),
    body('description').isLength({min:8}).trim(),
],isAuth,adminControllers.postAddProducts);

router.get("/edit-product/:productId",isAuth,adminControllers.getEditProduct);

router.post("/edit-product",[
    body('Title').isString().isLength({min:3}).trim(),
    body('imageUrl'),
    body('price').isFloat(),
    body('description').isLength({min:8}).trim(),
],isAuth,adminControllers.postEditProducts);

router.post("/delete-product",isAuth,adminControllers.postDeleteProducts); 
module.exports=router;
