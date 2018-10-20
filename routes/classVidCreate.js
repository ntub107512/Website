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

  var classNo=req.query.classNo;

  pool.query('select * from class where classNo=?', [classNo], function(err, results) {
    res.render('classVidCreate', {memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,picture:req.session.picture,classNo:classNo,data:results});
  });
});

module.exports = router;
