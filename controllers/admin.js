const Product = require('../models/product');

const {validationResult}=require('express-validator')

const fileHelper=require('../util/file')


exports.addProduct= (req,res,next) => {
    res.render('admin/edit-product' , {
        doc:"Add product", 
        path:"/admin/add-product",
        editing:false,
        hasError:false,
        errorMessage:null,
        validationErrors:[]
    });
};

exports.postAddProducts= (req,res,next) => {
    const title= req.body.Title;
    const image= req.file;
    const description= req.body.description;
    const price= req.body.price;
    if(!image)
    {
        return res.status(422).render('admin/edit-product' , { 
            doc:"Add product", 
            path:"/admin/add-product",
            editing:false,
            hasError:true,
            product:{
                title:title,
                price:price,
                description:description
            },
            errorMessage:'Attached File is not an image',
            validationErrors:[]
        });
    }

    const imageUrl=image.path;
    console.log(imageUrl)
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     return res.status(422).render('admin/edit-product' , { 
    //         doc:"Add product", 
    //         path:"/admin/add-product",
    //         editing:false,
    //         hasError:true,
    //         product:{
    //             title:title,
    //             imageUrl:imageUrl,
    //             price:price,
    //             description:description
    //         },
    //         errorMessage:errors.array()[0].msg,
    //         validationErrors:errors.array()
    //     });
    // }
    const product= new Product({
        title:title,
        price:price,
        description:description,
        imageUrl:imageUrl,
        userId:req.user._id
    })
    product.save()
    .then(result=>{
        res.redirect('/admin/products');
    })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error)
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
            product:product,
            hasError:false,
            errorMessage:null,
            validationErrors:[]
        });
    }).catch(err=>{
       const error=new Error(err);
        error.httpStatusCode=500;
        return next(error)
    });
};

exports.postEditProducts =(req,res,next) =>{
    const prodId=req.body.productId;
    const updatedTitle=req.body.Title;
    const updatedPrice=req.body.price;
    const image=req.file;
    const updatedDescription=req.body.description;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('admin/edit-product' , { 
            doc:"Edit product", 
            path:"/admin/edit-product",
            editing:true,
            hasError:true,
            product:{
                title:updatedTitle,
                price:updatedPrice,
                description:updatedDescription,
                _id:prodId
            },
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
        });
    }
    Product.findById(prodId).then(product=>{
        if(product.userId.toString()!=req.user._id.toString())
        {
            return res.redirect('/');
        }
        product.title=updatedTitle;
        product.price=updatedPrice;
        product.description=updatedDescription;
        if(image)
        {
            fileHelper.deleteFile(product.imageUrl)
            product.imageUrl=image.path;
        }
        return product.save()
        .then(result=>{
            console.log(result);
            res.redirect('/admin/products');
        })
    })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error)
    })

}

exports.postDeleteProducts =(req,res,next) =>{
    const prodId=req.body.productId;
    Product.findById(prodId)
    .then(product=>{
        if(!product)
        {
            next(err);
        }
        fileHelper.deleteFile(product.imageUrl)
        return  Product.deleteOne({_id:prodId,userId:req.user._id})
    })
    .then(result=>{
       res.redirect('/admin/products'); 
    })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error)
    })

};

exports.getAdminProducts = (req,res,next) => {
    Product.find({userId:req.user._id})
    .then((products) => {
        res.render('admin/products',{pro:products ,doc:'Admin Products', path:'admin/products'});
    })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error)
    })
};




