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
	var hwNo=req.query.hwNo.hwNum;
	var hwAnsNo=req.query.hwAnsNo;
	var classFileNo=req.query.classFileNo.classFileNum;
	var classNo=req.query.classNo.classNum;
	var checksData;

	pool.query('SELECT a.*, b.* FROM hwans a, smember b WHERE a.memNo=b.memNo and a.hwNo=? and a.hwAnsNo=?',[hwNo,hwAnsNo],function(err, results) {
		console.log('*********************************');
		console.log(hwNo);
		console.log(hwAnsNo);
		checksData=results[0].checks;
		console.log('*********************************');
		console.log(checksData);
	

		if(checksData=="no"){
			pool.query('SELECT a.*, b.* FROM hwans a, smember b WHERE a.checks="no" and a.hwAnsNo=? and a.memNo=b.memNo',[hwAnsNo],function(err, results) {
				console.log('*********************************');
				console.log(results);
				if (err)throw err;
				res.render('careerHWscore',{memNo:req.session.memNo, tmemName:req.session.tmemName, memTitle:req.session.memTitle, picture:req.session.picture, data:results, hwAnsNo:hwAnsNo, classFileNo:classFileNo, classNo:classNo, hwNo:hwNo});
			});
			
		}else if(checksData=="yes"){
			pool.query('SELECT a.*, b.*, c.* FROM hwans a, smember b, sresult c WHERE a.checks="yes" and a.hwAnsNo=? and a.memNo=b.memNo and c.hwAnsNo=?',[hwAnsNo,hwAnsNo],function(err, results) {
				console.log('*********************************');
				console.log(results);
				if (err)throw err;
				res.render('careerHWcorrectDetail',{memNo:req.session.memNo, tmemName:req.session.tmemName, memTitle:req.session.memTitle, picture:req.session.picture, data:results, hwAnsNo:hwAnsNo, classFileNo:classFileNo, classNo:classNo, hwNo:hwNo});
			});
		}
	});
});

module.exports = router;
