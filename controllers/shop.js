const Product = require('../models/product');
const Order = require('../models/order');

const fs=require('fs');
const PDFDOCUMENT=require('pdfkit')
const path = require('path');

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


exports.getInvoice=(req,res,next)=>{
    const orderId=req.params.orderId;
    Order.findById(orderId)
    .then((order)=>{
        if(!order)
        {
            return next(new Error('No order Found'));
        }
        if(order.user.userId.toString()!==req.user._id.toString())
        {
            return next(new Error('Unouthorized'));
        }
        const invoiceName='invoice-'+orderId+'.pdf';
    const invoicePath=path.join('data','invoices',invoiceName);

    const pdfDoc=new PDFDOCUMENT();
    res.setHeader('Content-Type','application/pdf');
    res.setHeader(
        'Content-Deposition','inline; filename="'+invoiceName+'"'
    );
    pdfDoc.pipe(fs.createWriteStream(invoicePath));

    pdfDoc.pipe(res);
    pdfDoc.fontSize(26).text('Invoice',{
        underline:true
    });
    pdfDoc.text('--------------------------');
    let totalPrice=0;
    order.products.forEach(prod=>{
        totalPrice+=prod.quantity*prod.product.price;
        pdfDoc.fontSize(18).text(prod.product.title+' -  '+prod.quantity+' x '+' $'+prod.product.price);
    });
    pdfDoc.text('-------------------')
    pdfDoc.fontSize(18).text('Total Price: $'+totalPrice);
    pdfDoc.end();

    })
    .catch(err=>{
        next(err);
    })
   
}
