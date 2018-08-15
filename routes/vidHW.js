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
}).single('pic');  //表單中的檔案名稱

/* POST home page. */
router.post('/', function(req, res) {
  //上傳檔案
  upload(req, res, function (err) {
    //如果失敗
    if (err) {
        res.render('courseAddFail',{});
        return
    }     
    
   //上傳成功, 接著取得使用者傳來的參數
    var word=req.param("word");

    var memNo=req.session.memNo;

    var pic='';

    var checks="no";

    var classNo=req.query.classNo;
    var classFileNo=req.query.classFileNo.fileNo;

    
	// 如果有選擇圖片
    if (typeof req.file != 'undefined'){
        pic=req.file.filename;   //取得上傳照片新名稱             
    }
    //建立一個新資料物件
    var newData={
        word:word,
        memNo:memNo,
        pic:pic,
        checks:checks
    }	
    var hwNoData
    var hwAnsNoData
        pool.query('INSERT INTO hwans SET ?', newData, function(err, rows, fields) {
            if (err){
                //刪除先前已上傳的圖片
                picture='public/images/' + pic;
                    fs.unlink(pic, (err) => {
                        if (err) console.log('圖片檔尚未上傳');
                        console.log('已刪除圖片檔');
                    });		
                res.render('courseAddFail', {});     //新增失敗
            }else{
                pool.query('select * from hwans ORDER BY hwAnsNo DESC LIMIT 1', function(err, results) {
                    hwAnsNoData=results[0].hwAnsNo

                    pool.query('SELECT * FROM homework WHERE classFileNo=?',[classFileNo], function (err, results) {
                        hwNoData=results[0].hwNo

                        pool.query('UPDATE hwans SET hwNo=? WHERE hwAnsNo=?',[hwNoData,hwAnsNoData], function(err, rows, fields) {
                            res.render('vidHWSuccess', {memNo:req.session.memNo, smemName:req.session.smemName, memTitle:req.session.memTitle,spicture:req.session.spicture,classNo:classNo,classFileNo:classFileNo});  //新增成功
                        });
                    });

                });
        }
        });


   /* pool.query('INSERT INTO class SET ?', newData, function(err, rows, fields) {
        if (err){
            //刪除先前已上傳的圖片
            picture='public/images/' + picture;
				fs.unlink(picture, (err) => {
					if (err) console.log('圖片檔尚未上傳');
					console.log('已刪除圖片檔');
				});		
            res.render('courseAddFail', {});     //新增失敗
        }else{
            res.render('courseAddSuccess', {memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,picture:req.session.picture});  //新增成功
        }
        });*/
    })
});

module.exports = router;