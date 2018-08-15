var express = require('express');
var router = express.Router();
var mysql = require('mysql');


//----------------------------------------------
// 載入使用權檢查
//----------------------------------------------
var authorize = require('./lib/authorize.js');
//----------------------------------------------

//----------------------
// 引用db.js
//----------------------
var pool = require('./lib/db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  var diaryTagData;
  var memNo=req.session.memNo;

  //------------------	
// 先取出日記tag資料
//------------------
  pool.query('select * from diarytag ORDER BY tagNo', function(err, results) {       
      if (err) {
        diaryTagData=[];
      }else{
        diaryTagData=results;
      }
      pool.query('select * from tmember where memNo=?', [memNo], function(err, results) {
    
          res.render('careerDiaryBookCreateT', {diaryTagData:diaryTagData,memNo:req.session.memNo,memName:req.session.memName,memTitle:req.session.memTitle,data:results});
     }); 
    });
  });
  
module.exports = router;
