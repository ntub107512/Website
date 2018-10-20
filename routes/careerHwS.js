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
	console.log('*********************************');
	console.log(memNo);
	var className=req.query.className;
	var classData;
	var classNoData;
	var joinclassData;

	pool.query('SELECT a.*,b.* FROM joinclass a, smember b WHERE a.memNo=? and b.memNo=?',[memNo,memNo],function(err, results) {
		joinclassData=results;
		classNoData=results[0].classNo;
		console.log('*********************************');
		console.log(joinclassData);
		console.log(classNoData);

		pool.query('SELECT a.*, b.*, c.* FROM joinclass a, smember b, class c WHERE a.memNo=? and b.memNo=? and c.classNo=a.classNo and a.classNo=c.classNo',[memNo,memNo],function(err, results) {
			classData=results;
			console.log(classData);
			res.render('careerHwS', {memNo:req.session.memNo, smemName:req.session.smemName, memTitle:req.session.memTitle, spicture:req.session.spicture, data:results, joinclassData:joinclassData, classData:classData, className:className, classNoData:classNoData});
		});
	}); 
});
  
module.exports = router;
