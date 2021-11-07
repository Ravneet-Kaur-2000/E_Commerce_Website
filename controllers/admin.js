const Product = require('../models/product');

exports.addProduct= (req,res,next) => {
    res.render('admin/edit-product' , {doc:"Add product", path:"/admin/add-product",editing:false});
};

exports.postAddProducts= (req,res,next) => {
    const title= req.body.Title;
    const imageUrl= req.body.imageUrl;
    const description= req.body.description;
    const price= req.body.price;
    const product= new Product(title,price,description,imageUrl,null,req.user._id);
    product.save()
    .then(result=>{
        res.redirect('/admin/products');
    })
    .catch(err=>{
        console.log(err);
    })
    
};

exports.getEditProduct= (req,res,next) => {
    const editMode=req.query.edit;
    if(!editMode)
    {
        return res.redirect('/');
    }
    const prodId=req.params.productId;
    Product.findById(prodId).then(product=>{
        if(!product){
            
            return res.redirect('/');
        }
        console.log(product);
        res.render('admin/edit-product' , { 
            doc:"Edit product", 
            path:"/admin/edit-product",
            editing:editMode,
            product:product
        });
    }).catch(err=>{
        console.log(err)
    });
};

exports.postEditProducts =(req,res,next) =>{
    const prodId=req.body.productId;
    const updatedTitle=req.body.Title;
    const updatedPrice=req.body.price;
    const updatedimageUrl=req.body.imageUrl;
    const updatedDescription=req.body.description;
    const product=new Product(updatedTitle,updatedPrice,updatedDescription,updatedimageUrl,prodId);
    product.save()
    .then(result=>{
        console.log(result);
        res.redirect('/admin/products');
    })
    .catch(err=>{
        console.log(err);
    })

}

exports.postDeleteProducts =(req,res,next) =>{
    const prodId=req.body.productId;
    Product.deleteById(prodId).then(result=>{
       res.redirect('/admin/products'); 
    })
    .catch(err=>{
        console.log(err);
    })

};

exports.getAdminProducts = (req,res,next) => {
    Product.fetchAll()
    .then((products) => {
        res.render('admin/products',{pro:products ,doc:'Admin Products', path:'admin/products'});
    })
    .catch(err=>{
        console.log(err);
    })
};




