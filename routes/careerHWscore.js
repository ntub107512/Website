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
  var memNo=req.session.memNo;
  var hwAnsNo=req.query.hwAnsNo;
  
  pool.query('SELECT a.*, b.* FROM hwans a, smember b WHERE a.checks="no" and a.hwAnsNo=? and a.memNo=b.memNo',[hwAnsNo], function(err, results) {
    if (err)throw err;

    res.render('careerHWscore', {memNo:req.session.memNo, smemName:req.session.smemName ,memTitle:req.session.memTitle,spicture:req.session.spicture,data:results,hwAnsNo:hwAnsNo});
  });
});

module.exports = router;
