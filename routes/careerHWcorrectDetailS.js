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
	var classFileNo=req.query.classFileNo;
	var classNo=req.query.classNo;
	var hwNoSearchData;
	var hwAnsNoSearchData;

	pool.query('SELECT a.*, b.*	FROM classfile a, homework b WHERE a.classFileNo=? and b.classFileNo=?',[classFileNo,classFileNo],function(err, results) {
		hwNoSearchData=results[0].hwNo;
		console.log('*********************************');
		console.log(classFileNo);
		console.log(hwNoSearchData);

		pool.query('SELECT a.*, b.*, c.* FROM homework a, hwans b,smember c WHERE a.hwNo=? and b.hwNo=? and b.memNo=? and c.memNo=?',[hwNoSearchData,hwNoSearchData,memNo,memNo],function(err, results) {
			hwAnsNoSearchData=results[0].hwAnsNo;
			console.log('*********************************');
			console.log(hwAnsNoSearchData);
	
			pool.query('SELECT a.*, b.*, c.* FROM hwans a, smember b, sresult c WHERE  a.hwAnsNo=? and a.memNo=b.memNo and c.hwAnsNo=?',[hwAnsNoSearchData,hwAnsNoSearchData],function(err, results) {
				console.log('*********************************');
				console.log(results);
				if (err)throw err;

				if (results.length==0){
					pool.query('SELECT a.*, b.* FROM hwans a, smember b WHERE  a.hwAnsNo=? and a.memNo=b.memNo',[hwAnsNoSearchData],function(err, results) {
						res.render('careerHWcorrectDetailS',{memNo:req.session.memNo, smemName:req.session.tmemName, memTitle:req.session.memTitle, spicture:req.session.spicture, data:results});
					});
				}else{
					res.render('careerHWcorrectDetailS',{memNo:req.session.memNo, smemName:req.session.tmemName, memTitle:req.session.memTitle, spicture:req.session.spicture, data:results});

				}
			});
		});
	});

});

module.exports = router;
