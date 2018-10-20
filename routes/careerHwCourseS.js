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
	var classNo=req.query.classNo;
	var classFileNo=req.query.classFileNo;

	pool.query('SELECT a.*, b.*, c.*, d.* FROM classfile a, joinclass b, smember c, class d WHERE b.classNo=? and a.classNo=? and a.classNo=? and d.classNo=? and c.memNo=? and b.memNo=?',[classNo,classNo,classNo,classNo,memNo,memNo], function(err, results) {
		if (err)throw err;
		console.log('*********************************');
		console.log(results);
		res.render('careerHwCourseS', {memNo:req.session.memNo, smemName:req.session.smemName, memTitle:req.session.memTitle, spicture:req.session.spicture, data:results, classNo:classNo, classFileNo:classFileNo});
	}); 
 	
});  
module.exports = router;