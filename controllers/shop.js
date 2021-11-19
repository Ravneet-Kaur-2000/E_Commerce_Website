const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = (req,res,next) => {
    Product.find()
    // .select('title price')
    // .populate('userId','name email')
    .then(products=>{
            console.log(products)
            res.render('shop/product-list',{pro:products , doc:'Product List', path:'/products'});
        }
    )
    .catch(err=>{
        console.log(err);
    })
};


exports.getProduct =(req,res,next) =>{
    prodId= req.params.productId;
    console.log(prodId);
    Product.findById(prodId).then((product)=>{
        console.log(product);
        res.render('shop/product-detail',{product : product,doc:product.title, path:'/products'});
    })
    .catch(err=>{
        console.log(err);
    })
} 


exports.getIndex = (req,res,next) => {
    Product.find().then(
        products=>{
            res.render('shop/index',{pro:products , doc:'My Shop', path:'/index'});
        }
    )
    .catch(err=>{
        console.log(err);
    })
};

exports.getCart = (req,res,next) => {
    req.user
    .populate('cart.items.productId')
    .then(user=>{
            const products=user.cart.items;
            console.log(products);
            res.render('shop/cart',{doc:'Your Cart', path:'/cart',products:products});
        }
        ).catch(err=>{
            console.log(err);
        })
    }

exports.postCart =(req,res,next) => {
    const prodId=req.body.productId;
    Product.findById(prodId)
    .then(product=>{
        return req.user.addToCart(product);
    })
    .then(result=>{
        console.log(result);
        res.redirect('/cart');
    });

};


exports.postCartDeleteProducts =(req,res,next) =>{
    const prodId=req.body.productId;
    req.user.deleteItemFromCart(prodId)
    .then(()=>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(error))
   
};


exports.postOrder=(req,res,next)=>{
    req.user
    .populate('cart.items.productId')
    .then(user=>{
            const products=user.cart.items.map(i=>{
                return { quantity: i.quantity, product:{...i.productId._doc}};
            });
            const order=new Order({
                user:{
                    email:req.user.email,
                    userId:req.user
                },
                products:products
            });
            return order.save();
    })
    .then(result=>{
        req.user.clearCart();
    })
    .then(()=>{
        res.redirect('/orders');
    })
    .catch(err=>console.log(err))
}


exports.getOrders = (req,res,next) => {
    Order.find({'user.userId': req.user._id}).then(orders=>{
        res.render('shop/orders',{doc:'Your orders', path:'/orders',orders:orders});
    })
    .catch(err=>{
        console.log(err);
    })
};

