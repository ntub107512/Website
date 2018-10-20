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
	var className=req.query.className;
	var classData;
	var smemTotalCnt;
	var classNoData;

	pool.query('SELECT a.*,b.* FROM class a,tmember b WHERE a.memNo=? and b.memNo=?',[memNo,memNo],function(err, results) {
		classData=results;
		classNoData=results[0].classNo;
		console.log('*********************************');
		console.log(classData);
		console.log(classNoData);

		pool.query('SELECT count(*) AS smemTotal FROM joinclass a, class b WHERE b.memNo=? and b.classNo=? and a.classNo=?',[memNo,classNoData,classNoData],function(err, results) {
			smemTotalCnt=results[0].smemTotal;
			console.log('*********************************');
			console.log(smemTotalCnt);
			console.log(results);
			res.render('careerHw', {memNo:req.session.memNo, tmemName:req.session.tmemName, memTitle:req.session.memTitle, picture:req.session.picture, data:results, classData:classData, className:className, smemTotalCnt:smemTotalCnt, classNoData:classNoData});
		}); 
	}); 
});
  
module.exports = router;
