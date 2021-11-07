//importing express
const express=require('express');
const app=express();

//importng path module
const path=require('path');

require('dotenv').config();

//export error controller
const errorController = require('./controllers/error');


//importing database
const mongoConnect=require('./util/database').mongoConnect;

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
    User.findById('617bafc14b9921c581deee93')
    .then(user=>{
        req.user=new User(user.username,user.email,user.cart,user._id);
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

mongoConnect(()=>{
    app.listen(3000);
})





//app.get('/favicon.ico', (req, res) => res.sendStatus(204));




