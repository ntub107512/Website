var express = require('express');
var router = express.Router();
var mysql = require('mysql');
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
  var diaNo=req.query.diaNo;
  var memNo=req.session.memNo;

  var diaryTagData;


  //------------------	
// 先取出日記tag資料
//------------------
  pool.query('select * from diarytag ORDER BY tagNo', function(err, results) {       
      if (err) {
        diaryTagData=[];
      }else{
        diaryTagData=results;
        pool.query('select a.*,b.* from diary a,smember b  where a.diaNo=? and b.memNo=?', [diaNo,memNo], function(err, results) {
          pool.query('select * from smember where memNo=?', [memNo], function(err, results) {
            res.render('careerDiaryContentEditS', {memNo:req.session.memNo, memTitle:req.session.memTitle,data:results,diaryTagData:diaryTagData,diaNo:diaNo,data:results});
          });
        });
      }
    });

});

module.exports = router;
