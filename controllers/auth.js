const User=require('../models/user')
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
require('dotenv').config();
const { validationResult }=require('express-validator')


exports.getLogin = (req,res,next) => {
    let message=req.flash('error');
    if(message.length>0)
    {
        message=message[0];
    }
    else
    {
        message=null;
    }
    console.log(req.session.isloggedIn);
    res.render('auth/login',{
        doc:'Login', 
        path:'/login',
        errorMessage:message,
        oldInput:{email:"",password:""},
        validationErrors:[]
    });
};


exports.postLogin = (req,res,next) => {
    const email=req.body.email;
    const password=req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.render('auth/login', {
      path: '/login',
      doc: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput:{email:email,password:password},
      validationErrors:errors.array()
    });
  }
    User.findOne({email:email})
    .then(user=>{
        if(!user)
        {
            req.flash('error','Invalid Email or Password');
            return res.render('auth/login', {
                path: '/login',
                doc: 'Login',
                errorMessage:'Invalid Email or Password' ,
                oldInput:{email:email,password:password},
                validationErrors:[]
            });
        }
        bcrypt.compare(password,user.password)
        .then(doMatch=>{
            if(doMatch)
            {
                req.session.user=user;
                req.session.isloggedIn=true; 
                return req.session.save(err=>{
                    console.log(err);
                    res.redirect('/');
                });
            }
            // req.flash('error','Invalid Email or Password');
            // res.redirect('/login');
            return res.render('auth/login', {
                path: '/login',
                doc: 'Login',
                errorMessage:'Invalid Email or Password' ,
                oldInput:{email:email,password:password},
                validationErrors:[]
            });
        })
        .catch(err=>{
            res.redirect('/login');
        })
    })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error)
    })
};

exports.postLogout = (req,res,next) => {
    req.session.destroy(()=>{
        res.redirect('/')
    })
};

exports.getSignup = (req, res, next) => {
    let message=req.flash('error');
    if(message.length>0)
    {
        message=message[0];
    }
    else
    {
        message=null;
    }
    res.render('auth/signup', {
      path: '/signup',
      doc: 'Signup',
      isAuthenticated: false,
      errorMessage:message,
      oldInput:{email:"",password:"",confirmPassword:""},
      validationErrors:[]
    });
 };

  exports.postSignup = (req, res, next) => {
      const email=req.body.email;
      const password=req.body.password;
      const confirmPassword=req.body.confirmPassword;
      const errors=validationResult(req);
      if(!errors.isEmpty())
      {
          console.log(errors)
          return res.status(422).render('auth/signup', {
            path: '/signup',
            doc: 'Signup',
            isAuthenticated: false,
            errorMessage:errors.array()[0].msg,
            oldInput:{email:email,password:password,confirmPassword:req.body.confirmPassword},
            validationErrors:errors.array()
          })
      }
        bcrypt.hash(password,12)
        .then(hashedPassword=>{
            const user=new User({
            email:email,
            password:hashedPassword,
            cart:{items:[]}
        });
            return user.save();
        })
        .then(result=>{
            res.redirect('/login');
            return transporter.sendMail({
                to:email,
                from:'ecommerce@gmail.com',
                subject:'Registration successfull',
                html:'<h1>Signed up</h1>'
            });
        })
        .catch(err=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error)
        })
  };


