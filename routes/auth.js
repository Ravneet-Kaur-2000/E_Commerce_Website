const express = require('express');
const path= require('path');
const router = express.Router();
const authController= require('../controllers/auth');
const User=require('../models/user');

const {check,body}=require('express-validator')

router.get('/login',authController.getLogin);

router.post('/login',
[
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password', 'Please enter a password with only numbers and text and atleast 3 characters').trim().isLength({min: 3}).isAlphanumeric()
],authController.postLogin);

router.post('/logout',authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup',
[
check('email').isEmail().withMessage('Please enter a valid Email Address')
.custom((value,{req})=>{
    return User.findOne({email:value})
    .then(userDoc=>{
    if(userDoc)
    {
        return Promise.reject('Email already exists');
    }
})
}),
body('password','Please enter a password with only numbers and text and atleast 3 characters').trim().isLength({min:3}).isAlphanumeric(),
body('confirmPassword').trim().custom((value, {req})=>{
    if(value!==req.body.password)
    {
        throw new Error('Passwords have to match!');
    }
    return true;
})
], 
authController.postSignup);
// router.get('/reset', authController.getReset);
// router.post('/reset', authController.postReset);

module.exports=router;