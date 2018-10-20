var express = require('express');
var router = express.Router();

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
  var classFileNo=req.query.classFileNo;
  console.log(classFileNo);

  res.render('classStepCreate2', {memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,classFileNo:classFileNo });
});

module.exports = router;
