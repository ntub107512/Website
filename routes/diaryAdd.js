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
}).single('conPic');  //表單中的檔案名稱



/* POST home page. */
router.post('/', function(req, res) {

  upload(req, res, function (err) {
    //如果失敗
    if (err) {
        res.render('picFileSizeFail',{});
        return
    }     
  //到diaContent的值
    var conDate=req.param("conDate");
    var conPic='';
    var mood=req.param("mood");
    var weather=req.param("weather");
    var content=req.param("content");
    var diaNo=req.query.diaNo;

    var memNo=req.session.memNo;

	// 如果有選擇圖片
    if (typeof req.file != 'undefined'){
        conPic=req.file.filename;   //取得上傳照片新名稱             
    }
    //建立一個新資料物件  
    var contentData={
        conDate:conDate,
        mood:mood,
        weather:weather,
        conPic:conPic,
        content:content,
        diaNo:diaNo
    }	
//建立一個新資料物件
   /*var diaConData={
    tagNo:tagNo,
   
  }	*/
    pool.query('INSERT INTO diacontent SET ?', contentData, function(err, rows, fields) {
        if (err){
            //刪除先前已上傳的圖片
            conPic='public/images/' + conPic;
				fs.unlink(conPic, (err) => {
					if (err) console.log('圖片檔尚未上傳');
					console.log('已刪除圖片檔');
				});		
            res.render('diaryAddFail', {});     //新增失敗
        }else{
            res.render('diaryAddSuccess', {});
        }
        });
    })
});

module.exports = router;