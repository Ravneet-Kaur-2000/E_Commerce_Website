const Product = require('../models/product');

exports.addProduct= (req,res,next) => {
    res.render('admin/edit-product' , {doc:"Add product", path:"/admin/add-product",editing:false});
};

exports.postAddProducts= (req,res,next) => {
    const title= req.body.Title;
    const imageUrl= req.body.imageUrl;
    const description= req.body.description;
    const price= req.body.price;
    req.user.createProduct({
        title:title,
        price:price,
        imageUrl:imageUrl,
        description:description, 
    })
    // Product.create({
    //     title:title,
    //     price:price,
    //     imageUrl:imageUrl,
    //     description:description,
    //     userId:req.user.id
    // })
    .then(result=>{
        res.redirect('/admin/products');
    })
    .catch(err=>{
        console.log(err);
    })
    // const product= new Product(null,title,imageUrl,description,price);
    // product.save().then(()=>{
    //     res.redirect('/');
    // })
    // .catch(err=>{
    //     console.log(err);
    // })
    
};

exports.getEditProduct= (req,res,next) => {
    const editMode=req.query.edit;
    if(!editMode)
    {
        return res.redirect('/');
    }
    const prodId=req.params.productId;
    // req.user.getProducts()
    Product.findByPk(prodId).then(product=>{
        if(!product){
            
            return res.redirect('/');
        }
        res.render('admin/edit-product' , { 
            doc:"Edit product", 
            path:"/admin/edit-product",
            editing:editMode,
            product:product
        });
    }).catch(err=>{
        console.log(err)
    });
    // Product.findById(prodId,(product) =>{
    //     if(!product){
            
    //         return res.redirect('/');
    //     }
    //     res.render('admin/edit-product' , { 
    //         doc:"Edit product", 
    //         path:"/admin/edit-product",
    //         editing:editMode,
    //         product:product
    //     });
};

exports.postEditProducts =(req,res,next) =>{
    const prodId=req.body.productId;
    const updatedTitle=req.body.Title;
    const updatedPrice=req.body.price;
    const updatedimageUrl=req.body.imageUrl;
    const updatedDescription=req.body.description;
    Product.findByPk(prodId).then(product=>{
        product.title=updatedTitle,
        product.price=updatedPrice,
        product.imageUrl=updatedimageUrl,
        product.description=updatedDescription
        return product.save();
    })
    .then(result=>{
        console.log(result);
        res.redirect('/admin/products');
    })
    .catch(err=>{
        console.log(err);
    })

    // const updatedProduct=new Product(prodId,updatedTitle,updatedimageUrl,updatedDescription,updatedPrice);
    // updatedProduct.save();
    // res.redirect('/admin/products');
}

exports.postDeleteProducts =(req,res,next) =>{
    const prodId=req.body.productId;
    Product.destroy({where:{id:prodId}}).then(result=>{
       res.redirect('/admin/products'); 
    })
    .catch(err=>{
        console.log(err);
    })
    // Product.deleteById(prodId);
    // res.redirect('/admin/products');
};
exports.getAdminProducts = (req,res,next) => {
    // Product.findAll()
    req.user.getProducts()
    .then((products) => {
        res.render('admin/products',{pro:products ,doc:'Admin Products', path:'admin/products'});
    })
    .catch(err=>{
        console.log(err);
    })
};




