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
  var pageNo=req.query.pageNo;
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
        pool.query('select a.*,b.* from diacontent a,tmember b  where a.pageNo=? and b.memNo=?', [pageNo,memNo], function(err, results) {
          
            res.render('careerDiaryContentEditT', {memNo:req.session.memNo, memTitle:req.session.memTitle,data:results,diaryTagData:diaryTagData,pageNo:pageNo,data:results});
        });
      }
    });

});

module.exports = router;
