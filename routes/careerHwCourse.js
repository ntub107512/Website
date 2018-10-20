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

	pool.query('SELECT a.*, d.*,c.* FROM classfile a, class d,tmember c WHERE d.classNo=? and a.classNo=? and c.memNo=?',[classNo,classNo,memNo], function(err, results) {
		if (err)throw err;
		console.log('*********************************');
		console.log(results);
		res.render('careerHwCourse', {memNo:req.session.memNo, tmemName:req.session.tmemName, memTitle:req.session.memTitle, picture:req.session.picture, data:results, classNo:classNo, classFileNo:classFileNo});
	}); 
 	
});  
module.exports = router;