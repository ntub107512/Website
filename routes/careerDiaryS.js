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
  pool.query('select * from smember where memNo=?', [memNo], function(err, results) {
      res.render('careerDiaryS', {memNo:req.session.memNo, memTitle:req.session.memTitle,spicture:req.session.spicture,data:results});
  });
});

module.exports = router;
