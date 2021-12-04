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
const User=require('./models/user');

//importing multer
const multer=require('multer')

//import flash
const flash=require('connect-flash');

const MONGODB_URI = 'mongodb+srv://RavneetKaur:KSQ2Kbfz5bhjzyEH@cluster0.c3xcx.mongodb.net/shop?retryWrites=true&w=majority'

//importing session
const session=require('express-session');
const MongoDBStore=require('connect-mongodb-session')(session);

const csrf=require('csurf');

const store=new MongoDBStore({
    uri:MONGODB_URI,
    collection:'sessions'
})

const csrfProtection=csrf();

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images')

    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
});


 
const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/png'|| file.mimetype==='image/jpg' || file.mimetype==='image/jpeg')
    {
        cb(null,true)
    }
    else{
        cb(null,false)
    }
}



//view engine ejs
app.set('view engine','ejs');
app.set('views','views');

//importing my modules routes
const adminRouter=require('./routes/admin');
const shopRouter=require('./routes/shop');
const authRouter=require('./routes/auth');


//for body parsing
app.use(express.urlencoded({extended:true}));
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'))

app.use(session({ 
    secret:'xyz', 
    resave:false, 
    saveUninitialized:false, 
    store:store
}))

app.use(csrfProtection);
app.use(flash());

app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isloggedIn;
    res.locals.csrfToken=req.csrfToken();
    next();
})

//for the css files to be made available to user
app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images')));

app.use((req,res,next)=>{
    if(!req.session.user)
    {
        return next();
    }
    User.findById(req.session.user)
    .then(user=>{
        if(!user)
        {
            return next();
        }
        req.user=user;
        next();
    })
    .catch(err=>{
        next(new Error(err));
    })
})


//routing logic
app.use('/admin',adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use('/500',errorController.error500)
app.use(errorController.error400);

// app.use((error,req,res,next)=>{
//     res.status(500).render('500-error',{
//         doc:'500 Error' , 
//         path:'',
//         isAuthenticated:req.session.isLoggedIn});
// })

mongoose.connect(MONGODB_URI)
.then(result=>{
    console.log('Connected');
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})



//app.get('/favicon.ico', (req, res) => res.sendStatus(204));




   
