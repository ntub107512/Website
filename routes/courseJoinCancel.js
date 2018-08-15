var express = require('express');
var router = express.Router();
var mysql = require('mysql');

//------------------
// 載入資料庫連結
//------------------
var pool = require('./lib/db.js');

//----------------------------------------------
// 載入使用權檢查
//----------------------------------------------
var authorize = require('./lib/authorize.js');
//----------------------------------------------

/* POST home page. */
router.get('/', function(req, res,next) {
    //------------------------------------------
    // 如尚未登入, 轉至未登入頁面
    //------------------------------------------
    if(!authorize.isPass(req)){
      res.render(authorize.illegalURL, {});
      return;
    }
  //------------------------------------------
   //取得使用者傳來的參數
    var memNo=req.session.memNo;
    var classNo=req.query.classNo;

    //建立一個新資料物件
    var newData={
        memNo:memNo,
        classNo:classNo
    }	
  
        pool.query('UPDATE joinclass set classNo=NULL where memNo=? AND classNo=?', [memNo,classNo], function(err, rows, fields) {
            console.log("------------------------");
            console.log(classNo);
            console.log("------------------------");
            if (err){
                res.render('addFail', {});     //新增失敗
            }else{
                res.render('cancelCourseSuccess', {memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,picture:req.session.picture});  //新增成功
            }
        });

    })
module.exports = router;