const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');


exports.getProducts = (req,res,next) => {
    Product.findAll().then(
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
    Product.findAll({where:{id:prodId}}).then((product)=>{
        res.render('shop/product-detail',{product : product[0],doc:product[0].title, path:'/products'});
    })
    .catch(err=>{
        console.log(err);
    })
} 

exports.getIndex = (req,res,next) => {
    Product.findAll().then(
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
    .then(cart=>{
        return cart.getProducts().then(products=>{
            res.render('shop/cart',{doc:'Your Cart', path:'/cart',products:products});
        }
        ).catch(err=>{
            console.log(err);
        })
    })
    .catch(err=>{
        console.log(err);
    })
    
    
};

exports.postCart =(req,res,next) => {
    const prodId=req.body.productId;
    let fetchedCart;
    let newQuantity=1;
    req.user.getCart()
    .then(cart=>{
        fetchedCart=cart;
        return cart.getProducts({where:{id:prodId}});
    })
    .then(products=>{
        let product;
        if(products.length>0)
        {
            product=products[0];
        }
        if(product)
        {
            const oldQuantity=product.cartItem.quantity;
            newQuantity=oldQuantity+1;
            return product;
        }
        return Product.findByPk(prodId)
    })
    .then(product=>{
        return fetchedCart.addProduct(product,{ through:{quantity:newQuantity}});
    })
    .then(()=>{
        res.redirect('/');
    })
    .catch(err=>console.log(error))
    // Product.findById(prodId, (product)=>{
    //     Cart.addProduct(prodId,product.price);
    // });
    // console.log(prodId);
    // res.redirect('/');
};

exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout',{pro:products , doc:'Your Checkout', path:'/checkout'});
};

exports.postCartDeleteProducts =(req,res,next) =>{
    const prodId=req.body.productId;
    req.user.getCart()
    .then(cart=>{
        return cart.getProducts({where:{id:prodId}});
    })
    .then(products=>{
        const product=products[0];
        product.cartItem.destroy();
    })
    .then(()=>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(error))
    // Product.findById(prodId, product =>{
    //     Cart.deleteProduct(prodId,product.price);
    //     res.redirect('/cart');
    // });
};


exports.postOrder=(req,res,next)=>{
    let fetchedCart;
    req.user.getCart()
    .then(cart=>{
        fetchedCart=cart;
        return cart.getProducts();
    })
    .then(products=>{
       return req.user.createOrder()
       .then(order=>{
           return order.addProduct(products.map(product=>{
               product.orderItem={quantity:product.cartItem.quantity};
               return product;
           }))
       })
       .catch(err=>{
           console.log(err);
       })

    })
    .then((result)=>{
        return fetchedCart.setProducts(null);
    })
    .then(result=>{
        res.redirect('/orders');
    })
    .catch(err=>console.log(error))
}


exports.getOrders = (req,res,next) => {
    req.user.getOrders({include: ['products']})
    .then(orders=>{
        res.render('shop/orders',{doc:'Your orders', path:'/orders',orders:orders});
    })
    .catch(err=>{
        console.log(err);
    })
};

