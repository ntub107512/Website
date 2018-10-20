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
///------------------------------------------
  // 如尚未登入, 轉至未登入頁面
  //------------------------------------------
  if(!authorize.isPass(req)){
    res.render(authorize.illegalURL, {});
    return;
  }
  //------------------------------------------
  var memNo=req.session.memNo;

  var diaryTagData;
  var tagNo=req.query.tagNo;

  pool.query('select a.*,b.*,c.tagName from diary a,smember b, diarytag c where a.tagNo=? and a.memNo=? and b.memNo=? and c.tagNo=?', [tagNo,memNo,memNo,tagNo], function(err, results) {
    if(results.length==0){
     
      pool.query('select * from smember where memNo=?',[memNo] ,function(err, results) {     
          res.render('careerDiaryBookCreateS', {memNo:req.session.memNo, memTitle:req.session.memTitle,picture:req.session.picture,data:results,diaryTagData:diaryTagData});
      });   
  }  
    else{
      res.render('careerDiaryBookS', {memNo:req.session.memNo, memTitle:req.session.memTitle,picture:req.session.picture,data:results,tagNo:tagNo});
  
    }
  });
});

module.exports = router;
