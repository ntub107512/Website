var express = require('express');
var router = express.Router();

var mysql = require('mysql');
//------------------
// 載入資料庫連結
//------------------
var pool = require('./lib/db.js');
//----------------------------------------------
// 載入使用權檢查
//----------------------------------------------
var authorize = require('./lib/authorize.js');
//----------------------------------------------

/* GET home page. */
router.get('/', function(req, res, next) {
  //------------------------------------------
  // 如尚未登入, 轉至未登入頁面
  //------------------------------------------
  if(!authorize.isPass(req)){
    res.render(authorize.illegalURL, {});
    return;
  }
//------------------------------------------
  var join=req.query.join.yesNo;
 

  if(join=="no"){
    res.render('courseLock', {});
  }else{
    var classNo=req.query.classNo;
    var classFileNo=req.query.classFileNo.fileNo;
    pool.query('select a.*,b.* from cfvid a,classfile b where a.classFileNo=? and b.classFileNo=?',[classFileNo,classFileNo], function (err, results) {
      if (err){
          res.render('courseLock', {});
      }else{
          res.render('classVidViewT', {data:results,memNo:req.session.memNo, tmemName:req.session.tmemName, memTitle:req.session.memTitle,picture:req.session.picture});
      }       
    });
  }

});

module.exports = router;
