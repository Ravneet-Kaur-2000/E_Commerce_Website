//importing express
const express=require('express');
const app=express();

//importng path module
const path=require('path');

require('dotenv').config();

//export error controller
const errorController = require('./controllers/error');

//import mongoose 
const mongoose=require('mongoose');

//impoting user model
const User=require('./models/user')

//view engine ejs
app.set('view engine','ejs');
app.set('views','views');

//importing my modules routes
const adminRouter=require('./routes/admin');
const shopRouter=require('./routes/shop');


//for body parsing
app.use(express.urlencoded({extended:true}));

app.use((req,res,next)=>{
    User.findById('6187a513f91aea99b4f4cb1c')
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>{
        console.log(err);
    })
   
})

//for the css files to be made available to user
app.use(express.static(path.join(__dirname,'public')));

//routing logic
app.use('/admin',adminRouter);
app.use(shopRouter);


app.use(errorController.error);

mongoose.connect('mongodb+srv://RavneetKaur:KSQ2Kbfz5bhjzyEH@cluster0.c3xcx.mongodb.net/shop?retryWrites=true&w=majority')
.then(result=>{
User.findOne().then(user=>{
    if(!user)
    {
        const user=new User({
            name:'Ravneet',
            email:'rav@gmail.com',
            cart:{
                items:[]
            }
        })
        user.save();
    }
})
    console.log('Connected');
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})



//app.get('/favicon.ico', (req, res) => res.sendStatus(204));




