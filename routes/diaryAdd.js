var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');

//----------------------------------------------
// 載入使用權檢查
//----------------------------------------------
var authorize = require('./lib/authorize.js');
//----------------------------------------------

//------------------
// 載入資料庫連結
//------------------
var pool = require('./lib/db.js');

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
}).single('diaPic');  //表單中的檔案名稱



/* POST home page. */
router.post('/', function(req, res) {

  upload(req, res, function (err) {
    //如果失敗
    if (err) {
        res.render('picFileSizeFail',{});
        return
    }     
   //傳到diary值
    var tagNo=req.param("tagNo");
    var diaDate=req.param("diaDate");
    var diaPic='';
    var mood=req.param("mood");
    var weather=req.param("weather");
    var content=req.param("content");
    var memNo=req.session.memNo;
  //到diaContent的值
    var content=req.param("content")

	// 如果有選擇圖片
    if (typeof req.file != 'undefined'){
        diaPic=req.file.filename;   //取得上傳照片新名稱             
    }
    //建立一個新資料物件
    var diaryData={
        tagNo:tagNo,
        diaDate:diaDate,
        diaPic:diaPic,
        mood:mood,
        weather:weather,
        content:content,
        memNo:memNo
    }	
//建立一個新資料物件
   /*var diaConData={
    tagNo:tagNo,
   
  }	*/
    pool.query('INSERT INTO diary SET ?', diaryData, function(err, rows, fields) {
        if (err){
            //刪除先前已上傳的圖片
            diaPic='public/images/' + diaPic;
				fs.unlink(diaPic, (err) => {
					if (err) console.log('圖片檔尚未上傳');
					console.log('已刪除圖片檔');
				});		
            res.render('diaryAddFail', {});     //新增失敗
        }else{
            res.render('diaryAddSuccess', {});  //新增成功
        }
        });
    })
});

module.exports = router;