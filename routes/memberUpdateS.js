var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');

//------------------
// 載入資料庫連結
//------------------
var pool = require('./lib/db.js');

//----------------------------------------------
// 載入使用權檢查
//----------------------------------------------
var authorize = require('./lib/authorize.js');
//----------------------------------------------

//-----------------
// 引用multer外掛
//----------------- 
var multer  = require('multer');
//---------------------------------
// 宣告上傳存放空間及檔名更改
//---------------------------------
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
         //檔案存在<public>內的<images>中.
        cb(null, 'public\\images');
    },

    filename: function (req, file, cb) {
        //將檔名前增加時間標記, 避免圖名重覆而被覆蓋. 
        cb(null, Date.now()+"--"+file.originalname);    
    }   
})

//-----------------------------------------------
// 產生multer的上傳物件
//-----------------------------------------------
var maxSize=800*1024;  //設定最大可接受圖片大小(800K)

var upload = multer({
    storage:storage,
    limits:{ fileSize: maxSize }
}).single('spicture');  //表單中的檔案名稱


/* GET home page. */
router.post('/', function(req, res) {

  upload(req, res, function (err) {
    //如果失敗
    if (err) {
        res.render('picFileSizeFail',{});
        return
    }     
// 取得使用者傳來的參數
var memNo=req.session.memNo;
var smemName=req.param("smemName");
var memEmail=req.param("memEmail");
var memPhone=req.param("memPhone");
var sGrade=req.param("sGrade");
var memSchool=req.param("memSchool");
var spicture='';

  // 如果有選擇圖片
if (typeof req.file != 'undefined'){
    spicture=req.file.filename;   //取得上傳照片新名稱             
  
// 將更改資料
pool.query('UPDATE smember SET smemName=?, memEmail=?, memPhone=?, sGrade=?, memSchool=?,spicture=? where memNo=?', [smemName, memEmail, memPhone, sGrade, memSchool,spicture, memNo], function(err, rows, fields) {
  if (err){				
      //刪除先前已上傳的圖片
      spicture='public/images/' + spicture;
      fs.unlink(spicture, (err) => {
        if (err) console.log('圖片檔尚未上傳');
        console.log('已刪除圖片檔');
      });				
    res.render('memUpdateFailT', {});     //導向更改失敗頁面
  }else{
        pool.query('select * from smember where memNo=?', [memNo], function(err, results) {
        res.render('memUpdateSuccessS', {memNo:req.session.memNo,smemName:req.session.smemName,memTitle:req.session.memTitle,data:results});  //導向更改成功頁面
      }); 
    }	
  })
}else{
  // 將更改資料
  pool.query('UPDATE smember SET smemName=?, memEmail=?, memPhone=?, sGrade=?, memSchool=? where memNo=?', [smemName, memEmail, memPhone, sGrade, memSchool, memNo], function(err, rows, fields) {
    if (err){			
      res.render('memUpdateFailT', {});     //導向更改失敗頁面
    }else{
          pool.query('select * from smember where memNo=?', [memNo], function(err, results) {
          res.render('memUpdateSuccessS', {memNo:req.session.memNo,smemName:req.session.smemName,memTitle:req.session.memTitle,data:results});  //導向更改成功頁面
        }); 
      }	
    
  })
}

});
});
module.exports = router;
