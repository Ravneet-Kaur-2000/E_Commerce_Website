// const mongodb=require('mongodb');
// const MongoClient=mongodb.MongoClient;

// let _db;
// const mongoConnect= callback =>{
//     MongoClient.connect(
//         'mongodb+srv://RavneetKaur:KSQ2Kbfz5bhjzyEH@cluster0.c3xcx.mongodb.net/shop?retryWrites=true&w=majority'
//     )
//     .then(client=>{
//         console.log('Connected!!');
//         _db=client.db();
//         callback(client);
//     })
//     .catch(err=>{
//         console.log(err);
//     });
// };

// const getDb= ()=>{
//     if(_db){
//         return _db;
//     }
//     throw "No database found!!";
// }
// exports.mongoConnect=mongoConnect;
// exports.getDb=getDb;

