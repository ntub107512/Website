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
  var chooseData;
  pool.query('select a.*,b.* from class a,classfile b where b.classFileNo=? ', [classFileNo],function (error, results, fields) {
    chooseData=results[0].choose;
    if(chooseData=="Vid"){
        console.log("進入vid")
        pool.query('select a.*,b.*,c.* from cfvid a,classfile b,class c where a.classFileNo=? and b.classFileNo=? and c.classNo=b.classNo ', [classFileNo,classFileNo],function (error, results, fields) {
         if (error){
            res.render('productList', {data:[]});
         }else{
            res.render('classVidEdit', {memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,data:results});
         }       
     });
    }else if (chooseData=="Step"){
        console.log("進入Step")
        pool.query('select a.*,b.*,c.* from cfstep a,classfile b,class c where a.classFileNo=? and b.classFileNo=? and c.classNo=b.classNo ', [classFileNo,classFileNo],function (error, results, fields) {
            if (error){
               res.render('productList', {data:[]});
            }else{
               res.render('classStepEdit', {memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,data:results});
            }       
        });
    }
    
    });
});

module.exports = router;