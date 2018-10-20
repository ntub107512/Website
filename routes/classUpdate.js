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
router.post('/', function(req, res,next) {
  
  // 取得使用者傳來的參數
  var className=req.param("className");
  var describes=req.param("describes");
  var classNo=req.query.classNo;


  console.log(className);
  console.log("--------------------");
  console.log(describes);
  console.log("--------------------");
  console.log(classNo);
  console.log("--------------------");
  
      pool.query('UPDATE class set className=?, describes=? where classNo=?', [className, describes, classNo], function(err, rows, fields) {
          if (err){
              res.render('memUpdateFail', {});   
          }else{
              res.render('classUpdateSuccess', {}); 
          }
      });

})

module.exports = router;
