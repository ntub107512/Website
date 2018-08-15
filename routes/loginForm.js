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
      res.render('loginForm', {});
      return;
    }
    //------------------------------------------

    //------------------------------------------
    // 如已經登入, 轉至首頁
    //------------------------------------------
    var memNo=req.session.memNo;
    var memTitle=req.session.memTitle;

    if(authorize.isPass(req)){

      if(memTitle=="大學生"){
        pool.query('select * from tmember where memNo=?', [memNo], function(err, results) {
          res.render('loginYes', {memNo:req.session.memNo, memTitle:req.session.memTitle,picture:req.session.picture,data:results});
        });
      }else{
        pool.query('select * from smember where memNo=?', [memNo], function(err, results) {
          res.render('loginYesS', {memNo:req.session.memNo, memTitle:req.session.memTitle,picture:req.session.picture,data:results});
        });
      }
      return;
  }
  //------------------------------------------
  //res.render('loginForm', { title: 'Express' });
});

module.exports = router;
