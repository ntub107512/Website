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
  var memNo=req.session.memNo;
  pool.query('select * from tmember where memNo=?', [memNo], function(err, results) {
    res.render('memberEditT', {memNo:req.session.memNo, memTitle:req.session.memTitle,picture:req.session.picture,data:results});  //導向更改成功頁面
  }); 
});

module.exports = router;
