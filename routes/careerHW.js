var express = require('express');
var router = express.Router();
//----------------------------------------------
// 載入使用權檢查
//----------------------------------------------
var authorize = require('./lib/authorize.js');
//----------------------------------------------

//------------------
// 載入資料庫連結
//------------------
var pool = require('./lib/db.js');

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
  var memNo=req.session.memNo;
  var hwansCount=0;
  var checkNoCount=0;
  var checkNoRate=0;

  
    pool.query('select count(*) as cnt1 from hwans', function(err, results) {
      if (err)throw err;
      hwansCount=results[0].cnt1; 
    pool.query('select count(*) as cnt from hwans where checks="no"', function(err, results) {
      if (err)throw err;
      
      checkNoCount=results[0].cnt; 
      pool.query('SELECT a.*, b.*,c.classFileNo,c.classNo,d.classNo,f.*,g.* FROM hwans a, homework b, classfile c, class d,smember f,tmember g WHERE a.checks="no" and a.hwNo=b.hwNo and c.classNo=d.classNo and c.classFileNo=b.classFileNo and d.memNo=? and f.memNo=a.memNo and g.memNo=?',[memNo,memNo], function(err, results) {
        if (err)throw err;
        
        checkNoRate= ((checkNoCount/hwansCount)*100); //計算幾%
        res.render('careerHW', {memNo:req.session.memNo, tmemName:req.session.tmemName ,memTitle:req.session.memTitle,picture:req.session.picture,data:results,checkNoCount:checkNoCount,checkNoRate:checkNoRate});
      });   
    });
    });
  });
  
  module.exports = router;


/*
  pool.query('select * from tmember where memNo=?', [memNo], function(err, results) {
  
  pool.query('select a.*, b.*, c.* from hwans a, smember b, homework c where a.checks="no" and a.memNo=? and a.hwNo=?',[memNo,hwNo], function(err, results) {
    if (err)throw err;

  pool.query('select count(*) as cnt1 from hwans', function(err, results) {
    if (err)throw err;
    hwansCount=results[0].cnt1; 
    
    pool.query('select count(*) as cnt from hwans where checks="yes"', function(err, results) {
      if (err)throw err;
      checkNoCount=results[0].cnt; 
      noCheckHw=hwansCount-checkNoCount;
      checkNoRate= ((checkNoCount/hwansCount)*100); //計算幾%
      res.render('careerHW', {memNo:req.session.memNo, memName:req.session.memName ,memTitle:req.session.memTitle,picture:req.session.picture,data:results,checkNoCount:checkNoCount,checkNoRate:checkNoRate,noCheckHw:noCheckHw});
    });   
  });
  });
  });
});

module.exports = router;*/