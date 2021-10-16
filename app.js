//importing express
const express=require('express');
const app=express();

//importng path module
const path=require('path');

require('dotenv').config();

//export error controller
const errorController = require('./controllers/error');

//importing database
const sequelize=require("./util/database.js")
const Product=require('./models/product');
const User=require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

//view engine ejs
app.set('view engine','ejs');
app.set('views','views');

//importing my modules routes
const adminRouter=require('./routes/admin');
const shopRouter=require('./routes/shop');


//for body parsing
app.use(express.urlencoded({extended:true}));

app.use((req,res,next)=>{
     User.findByPk(1).then(user=>{
         req.user=user;
         next();
     }).catch(err=>{
         console.log(err);
     })
})

//for the css files to be made available to user
app.use(express.static(path.join(__dirname,'public')));

//routing logic
app.use('/admin',adminRouter);
app.use(shopRouter);


app.use(errorController.error);

Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'}); //user created the product
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});

// sequelize.sync({force:true})
sequelize.sync()
.then(result=>{
     return User.findByPk(1)
})
.then(user=>{
    if(!user)
    {
        return User.create({name:'Ravneet',email:'rav@gmail.com'});
    }
    return Promise.resolve(user);
})
.then(user=>{
    return user.createCart();
})
.then(cart=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})





//app.get('/favicon.ico', (req, res) => res.sendStatus(204));




