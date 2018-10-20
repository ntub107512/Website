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
router.post('/', function(req, res, next) {
  //------------------------------------------
  // 如尚未登入, 轉至未登入頁面
  //------------------------------------------
  if(!authorize.isPass(req)){
    res.render(authorize.illegalURL, {});
    return;
  }
  	var memNo=req.session.memNo;
	var hwNoData;
	var classFileNo=req.query.classFileNo.classFileNum;
	var classNo=req.query.classNo.classNum;
	var hwNo=req.query.hwNo.hwNum;
	var hwAnsNo=req.query.hwAnsNo;
	var hwansCount=0;
	var checkNoCount=0;
	var checkNoRate=0;
	var checkYesCount=0;
	var checks="yes";

	var feedback=req.param("feedback");
	var result=req.param("result");
	console.log('*********************************');
  	console.log(result);
	var newData={
		hwAnsNo:hwAnsNo,
		result:result,
        feedback:feedback
    }

	pool.query('INSERT INTO sresult SET ?',[newData], function(err, results) {
		if (err)throw err;

		pool.query('UPDATE hwans SET checks=? WHERE hwNo=? and hwAnsNo=?',[checks,hwNo,hwAnsNo], function(err, results) {
			if (err)throw err;

			pool.query('SELECT * FROM homework WHERE classFileNo=?',[classFileNo], function(err, results) {
				console.log('*********************************');
				console.log(classFileNo);
				console.log(results);
				hwNoData=results[0].hwNo;

				pool.query('SELECT count(*) AS cnt1 FROM hwans WHERE hwNo=?',[hwNoData], function(err, results) {
					if (err)throw err;
					hwansCount=results[0].cnt1; 
					console.log('*********************************');
					console.log(hwansCount);

					pool.query('SELECT count(*) AS smemTotal FROM joinclass a, class b, classfile c, homework d WHERE b.memNo=? and b.classNo=? and a.classNo=? and c.classFileNo=? and d.classFileNo=?',[memNo,classNo,classNo,classFileNo,classFileNo],function(err, results) {
						smemTotalCnt=results[0].smemTotal;
						console.log('*********************************');
						console.log(classNo);
						console.log(classFileNo);
						console.log(smemTotalCnt);

						pool.query('SELECT count(*) AS cnt FROM hwans WHERE checks="no" and hwNo=? ', [hwNoData], function(err, results) {
							if (err)throw err;
							checkNoCount=results[0].cnt; 
							checkNoRate= (((hwansCount-checkNoCount)/smemTotalCnt)*100).toFixed(2); //計算幾%
							checkYesCount=hwansCount-checkNoCount;
							console.log('*********************************');
							console.log(checkNoCount); 
							console.log(checkNoRate); 

							pool.query('SELECT a.title, b.describes, c.*, d.*, e.* FROM classfile a, homework b, hwans c, tmember d, smember e WHERE d.memNo=? and a.classFileNo=? and b.hwNo=? and c.hwNo=? and e.memNo=c.memNo',[memNo,classFileNo,hwNoData,hwNoData], function(err, results) {
								console.log('*********************************');
								console.log(results);
								if (err)throw err;

								res.render('careerHwCourseHw', {memNo:req.session.memNo, tmemName:req.session.tmemName, memTitle:req.session.memTitle, picture:req.session.picture, data:results, classFileNo:classFileNo, hwNoData:hwNoData, hwansCount:hwansCount, checkNoCount:checkNoCount, checkNoRate:checkNoRate, checkYesCount:checkYesCount, smemTotalCnt:smemTotalCnt, classNo:classNo});
							}); 
						});
					});
				}); 
			});
		});	
	});
});

module.exports = router;
