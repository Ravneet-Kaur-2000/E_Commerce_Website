exports.error= (req,res,next)=>{
    //res.status(404).sendFile(path.join(__dirname,'views','404-error.html'));
    res.status(404).render('404-error',{doc:'404 Error' , path:''});
};