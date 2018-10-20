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
 //------------------	
// 先取出日記tag資料
  //------------------
  pool.query('select * from diarytag ORDER BY tagNo', function(err, results) { 
    diaryTagData=results;
  });
  pool.query('select a.*,b.*,c.tagName from diary a,tmember b, diarytag c where a.tagNo=? and a.memNo=? and b.memNo=? and c.tagNo=?', [tagNo,memNo,memNo,tagNo], function(err, results) {
    if(results.length==0){
      console.log(diaryTagData);
      pool.query('select * from tmember where memNo=?',[memNo] ,function(err, results) {     
          res.render('careerDiaryBookCreateT', {memNo:req.session.memNo, memTitle:req.session.memTitle,picture:req.session.picture,data:results,diaryTagData:diaryTagData});
      });   
    }  
    else{
      res.render('careerDiaryPlantT', {memNo:req.session.memNo, memTitle:req.session.memTitle,picture:req.session.picture,data:results,tagNo:tagNo,diaryTagDat:diaryTagData});
  
    }
    });
  
});

module.exports = router;
