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

var tagNo=req.query.tagNo;

    pool.query('select a.*,b.*,c.tagName from diary a,tmember b, diarytag c where a.tagNo=? and a.memNo=? and b.memNo=? and c.tagNo=?', [tagNo,memNo,memNo,tagNo], function(err, results) {
        if(results.length==0){
            //------------------	
            // 先取出日記tag資料
            //------------------
            pool.query('select * from diarytag', function(err, results) {       
                if (err) {
                diaryTagData=[];
                }else{
                diaryTagData=results;
                }
            });
            pool.query('select * from tmember where memNo=?',[memNo] ,function(err, results) {     
                res.render('careerDiaryContentCreateT', {memNo:req.session.memNo, memTitle:req.session.memTitle,picture:req.session.picture,data:results,diaryTagData:diaryTagData});
            });   
        }else{
            res.render('careerDiaryContentT', {memNo:req.session.memNo, memTitle:req.session.memTitle,picture:req.session.picture,data:results});
        }
       
    });
});
module.exports = router;

/*pool.query('select * from product', function (error, results, fields) {
        if (error){
            res.render('productList', {items:[]});
        }else{
            res.render('productList', {items:results});
        }       
    });*/