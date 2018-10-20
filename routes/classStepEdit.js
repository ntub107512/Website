var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');

var mysql = require('mysql');

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
  var stepNo=req.query.stepNo;
  var classFileNo=req.query.classFileNo.fileNo;
  pool.query('select a.*,b.* from cfstep a,classfile b where a.stepNo=? and a.classFileNo=? and b. classFileNo=?',[stepNo,classFileNo,classFileNo],  function(err, results) {
  
  res.render('classStepEdit-Detail', {data:results,memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle});
  
});
});

module.exports = router;
