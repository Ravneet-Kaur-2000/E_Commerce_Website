const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');


exports.getProducts = (req,res,next) => {
    Product.fetchAll().then(
        products=>{
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

// exports.getProduct =(req,res,next) =>{
//     prodId= req.params.productId;
//     Product.findAll({where:{id:prodId}}).then((product)=>{
//         res.render('shop/product-detail',{product : product[0],doc:product[0].title, path:'/products'});
//     })
//     .catch(err=>{
//         console.log(err);
//     })
// } 

exports.getIndex = (req,res,next) => {
    Product.fetchAll().then(
        products=>{
            res.render('shop/index',{pro:products , doc:'My Shop', path:'/index'});
        }
    )
    .catch(err=>{
        console.log(err);
    })
};

exports.getCart = (req,res,next) => {
    req.user.getCart()
    .then(products=>{
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

// exports.getCheckout = (req,res,next) => {
//     res.render('shop/checkout',{pro:products , doc:'Your Checkout', path:'/checkout'});
// };

exports.postCartDeleteProducts =(req,res,next) =>{
    const prodId=req.body.productId;
    req.user.deleteItemFromCart(prodId)
    .then(()=>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(error))
   
};


exports.postOrder=(req,res,next)=>{
    req.user.addOrder()
    .then(result=>{
        res.redirect('/orders');
    })
    .catch(err=>console.log(error))
}


exports.getOrders = (req,res,next) => {
    req.user.getOrders()
    .then(orders=>{
        res.render('shop/orders',{doc:'Your orders', path:'/orders',orders:orders});
    })
    .catch(err=>{
        console.log(err);
    })
};

