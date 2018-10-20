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
      cb(null, 'public\\video');
  },

  filename: function (req, file, cb) {
      //將檔名前增加時間標記, 避免圖名重覆而被覆蓋. 
      cb(null, Date.now()+"--"+file.originalname);    
  }   
})


//-----------------------------------------------
// 產生multer的上傳物件
//-----------------------------------------------
var upload = multer({
  storage:storage
}).single('video');  //表單中的檔案名稱



/* GET home page. */
router.post('/', function(req, res) {

  upload(req, res, function (err) {
    //如果失敗
    if (err) {
        res.render('picFileSizeFail',{});
        return
    }     
// 取得使用者傳來的參數
//------------------------------------------
 var classFileNo=req.query.classFileNo;
var memNo=req.session.memNo;
var title=req.param("title");
var word=req.param("word");

var video='';

  // 如果有選擇圖片
if (typeof req.file != 'undefined'){
  video=req.file.filename;   //取得上傳照片新名稱             
  
// 將更改資料
pool.query('UPDATE classfile SET title=? where classFileNo=?', [title,classFileNo], function(err, rows, fields) {
pool.query('UPDATE cfvid SET word=?,video=? where classFileNo=?', [word,video,classFileNo], function(err, rows, fields) {
  if (err){				
      //刪除先前已上傳的圖片
      video='public/images/' + video;
      fs.unlink(video, (err) => {
        if (err) console.log('圖片檔尚未上傳');
        console.log('已刪除圖片檔');
      });				
    res.render('memUpdateFailT', {});     //導向更改失敗頁面
  }else{
        
        res.render('courseT', {memNo:req.session.memNo,tmemName:req.session.tmemName,memTitle:req.session.memTitle});  //導向更改成功頁面
     
    }
  }); 
  })
}else{
  pool.query('UPDATE classfile SET title=? where classFileNo=?', [title,classFileNo], function(err, rows, fields) {
  // 將更改資料
  pool.query('UPDATE cfvid SET word=? where classFileNo=?', [word, classFileNo], function(err, rows, fields) {
    if (err){			
      res.render('memUpdateFailT', {});     //導向更改失敗頁面
    }else{
          
          res.render('courseT', {memNo:req.session.memNo,tmemName:req.session.tmemName,memTitle:req.session.memTitle,data:results});  //導向更改成功頁面
      
      }	
    })
  })
}

});
});
module.exports = router;
