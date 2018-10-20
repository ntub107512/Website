var express = require('express');
var router = express.Router();
var pool = require('./lib/db.js');

var mysql = require('mysql');

//----------------------------------------------
// 載入使用權檢查
//----------------------------------------------
var authorize = require('./lib/authorize.js');
//----------------------------------------------

/* GET home page. */
router.get('/', function(req, res, next) {
//------------------------------------------
// 如尚未登入, 轉至未登入頁面
//------------------------------------------
if(!authorize.isPass(req)){
  res.render(authorize.illegalURL, {});
  return;
}

var diaryTagData;
var memNo=req.session.memNo;
var tagNo=req.query.tagNo.tagNum;
var diaNo=req.query.diaNo;

    pool.query('select a.*,b.*,c.* from diacontent a,diarytag b,smember c where a.diaNo=? and b.tagNo=? and c.memNo=?', [diaNo,tagNo,memNo], function(err, results) {
        if(results.length==0){
            //------------------	
            // 先取出日記tag資料
            //------------------
            pool.query('select * from diarytag where tagNo=?', [tagNo], function(err, results) {       
                if (err) {
                diaryTagData=[];
                }else{
                diaryTagData=results;
                }
            });
            pool.query('select * from smember where memNo=?',[memNo] ,function(err, results) {     
                console.log(diaryTagData);
                res.render('careerDiaryContentCreateS', {memNo:req.session.memNo, memTitle:req.session.memTitle,picture:req.session.picture,data:results,diaryTagData:diaryTagData,diaNo:diaNo});
            });   
        }else{
            
            res.render('careerDiaryContentS', {memNo:req.session.memNo, memTitle:req.session.memTitle,picture:req.session.picture,data:results});
        }
       
    });
});
module.exports = router;
