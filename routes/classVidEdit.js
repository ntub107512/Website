var express = require('express');
var router = express.Router();
//----------------------------------------------------
// 透過require引用db.js的pool物件,
// 即使多個程式均引用, 在系統中只有一份pool物件.
//----------------------------------------------------
var pool = require('./lib/db.js');


/* GET home page. */
router.get('/', function(req, res, next) {

  //------------------------------------------
  var classFileNo=req.query.classFileNo;

    pool.query('select a.*,b.* from cfvid a,classfile b where a.classFileNo=? and b.classFileNo=? ', [classFileNo,classFileNo],function (error, results, fields) {
        if (error){
            res.render('productList', {data:[]});
        }else{
            res.render('classVidEdit', {memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,data:results});
        }       
    });
});

module.exports = router;