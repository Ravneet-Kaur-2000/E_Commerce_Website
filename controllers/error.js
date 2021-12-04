exports.error400= (req,res,next)=>{
    //res.status(404).sendFile(path.join(__dirname,'views','404-error.html'));
    res.status(404).render('404-error',{doc:'404 Error' , path:'',isAuthenticated:req.session.isLoggedIn});
};

exports.error500= (req,res,next)=>{
    //res.status(404).sendFile(path.join(__dirname,'views','404-error.html'));
    res.status(500).render('500-error',{doc:'500 Error' , path:'',isAuthenticated:req.session.isLoggedIn});
};