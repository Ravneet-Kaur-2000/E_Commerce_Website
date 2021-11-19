const User=require('../models/user')
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
require('dotenv').config();

//insitialise nodemailer
const nodemailer=require('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport')



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
        errorMessage:message
    });
};


exports.postLogin = (req,res,next) => {
    const email=req.body.email;
    const password=req.body.password;
    User.findOne({email:email})
    .then(user=>{
        if(!user)
        {
            req.flash('error','Invalid Email or Password');
            return res.redirect('/login');
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
            req.flash('error','Invalid Email or Password');
            res.redirect('/login');
        })
        .catch(err=>{
            res.redirect('/login');
        })
    })
    .catch(err=>{
        console.log(err);
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
      errorMessage:message
    });
 };

  exports.postSignup = (req, res, next) => {
      const email=req.body.email;
      const password=req.body.password;
      const confirmPassword=req.body.confirmPassword;
      User.findOne({email:email})
        .then(userDoc=>{
            if(userDoc)
            {
                req.flash('error','Email is already registered');
                return res.redirect('/signup');
            }
            else{
                return bcrypt.hash(password,12)
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
                    console.log(err);
                })
            }
        })
        .catch(err=>{
            console.log(err);
        })
  };


exports.getReset = (req, res, next) => {
    let message=req.flash('error');
    if(message.length>0)
    {
        message=message[0];
    }
    else
    {
        message=null;
    }
    res.render('auth/reset',{
    doc:'Reset Password', 
    path:'/reset',
    errorMessage:message
});
}

exports.postReset=(req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err)
        {
            console.log(err);
            return res.redirect('/reset');
        }
        const token=buffer.toString('hex');
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                req.flash('error','No user with that email id found');
                return res.redirect('/reset')
            }
            user.resetToken=token;
            user.resetTokenExpiration=Date.now()+360000;
            return user.save();
        })
        .then(result=>{
            res.redirect('/');
            return transporter.sendMail({
            to:req.body.email,
            from:'ecommerce@gmail.com',
            subject:'Password Reset',
            html:`
            <p>You requested a password reset</p>
            <p>Click on the <a href="http://localhost:3000/reset/${token}">link</a> set a new password</p>
            `
            }); 
        })
        .catch(err=>{
                console.log(err)
        })
    })
}