var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
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
var maxSize=800*1024;  //設定最大可接受影片大小(800K)

var upload = multer({
    storage:storage
}).single('video');  //表單中的檔案名稱


/* GET home page. */
router.post('/', function(req, res){

    upload(req, res, function (err) {
        //如果失敗
        if (err) {
            res.render('picFileSizeFail',{});
            return
        }     

    //取得使用者傳來的參數
    var title=req.param("title");
    var word=req.param("word");
    var video='';
    var describe=req.param("describe");
    
    var classNo=req.query.classNo;

	if (typeof req.file != 'undefined'){
        video=req.file.filename;   //取得上傳影片新名稱             
    }
    //建立一個新資料物件
    var newData1={
        word:word,
        video:video
    }
    var newData2={
        describe:describe
    }
    var newData3={
        title:title,
        classNo:classNo
    }

    var fileNoData
    var vidNoData
    var hwNoData

    pool.query('INSERT INTO classfile SET ?', newData3, function(err, rows, fields) {
        if (err){
            res.render('addFail', {});   
              //新增失敗
        }else{
            pool.query('INSERT INTO cfvid SET ?', newData1, function(err, rows, fields) {
                if (err){
                     //刪除先前已上傳的影片
                        video='public/video/' + video;
                        fs.unlink(video, (err) => {
                            if (err) console.log('影片檔尚未上傳');
                            console.log('已刪除影片檔');
                        });		
                    res.render('addFail', {});      //新增失敗
                }else{
                    pool.query('INSERT INTO homework SET ?', newData2, function(err, rows, fields) {
                        if (err){
                            res.render('addFail', {});     //新增失敗
                        }else{
                            pool.query('select * from classfile ORDER BY classFileNo DESC LIMIT 1', function(err, results) {
                                fileNoData=results[0].classFileNo
                            });
                                pool.query('select * from cfvid ORDER BY CFvidNo DESC LIMIT 1', function(err, results) {
                                    vidNoData=results[0].CFvidNo
                                pool.query('select * from homework ORDER BY hwNo DESC LIMIT 1', function(err, results) {
                                    hwNoData=results[0].hwNo                       

                                pool.query('UPDATE cfvid SET classFileNo=? where CFvidNo=?', [fileNoData,vidNoData],function(err, rows, fields) {
                                pool.query('UPDATE homework SET classFileNo=? where hwNo=?', [fileNoData,hwNoData],function(err, rows, fields) {
                                    console.log("---------------");
                                    console.log(fileNoData);
                                    console.log("---------------");
                                    console.log(vidNoData);
                                    console.log("---------------");
                                    console.log(hwNoData);
                                    console.log("---------------");
                                    res.render('vidAddSuccess', {memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,picture:req.session.picture,classNo:classNo});  //新增成功
                                });
                                });
                                });
                                });
                        }
                    });
                }
            });
        }
    });
})
});

module.exports = router;