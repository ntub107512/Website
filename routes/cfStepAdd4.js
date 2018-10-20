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
    storage:storage
}).array('pic',3); //表單中的檔案名稱



/* POST home page. */
router.post('/', function(req, res,next) {

  upload(req, res, function (err) {
    //如果失敗
    if (err) {
        res.render('picFileSizeFail',{});
        return
    }     
   //傳到step值  
    var memNo=req.session.memNo;

    var pic1='';
    var word1=req.param("word1");
    var pic2='';
    var word2=req.param("word2");
    var pic3='';
    var word3=req.param("word3");
    var stepNo1=10;
    var stepNo2=11;
    var stepNo3=12;
    console.log(req.files[0]);
    console.log(word2);
    console.log(word3);  
	// 如果有選擇圖片
    if (typeof req.files != 'undefined'){
        pic1=req.files[0].filename;
        pic2=req.files[1].filename;
        pic3=req.files[2].filename;   //取得上傳照片新名稱             
    }
    //建立一個新資料物件
    var stepData1
    var stepData2
    var stepData3
    var classFileNo=req.query.classFileNo;

        stepData1={
            stepPic:pic1,
            word:word1,
            classFileNo:classFileNo,
            stepNo:stepNo1
        }
        console.log(stepData1);
        stepData2={
            stepPic:pic2,
            word:word2,
            classFileNo:classFileNo,
            stepNo:stepNo2
        }
        console.log(stepData2);	
        stepData3={
            stepPic:pic3,
            word:word3,
            classFileNo:classFileNo,
            stepNo:stepNo3
        }
        console.log(stepData3);

        pool.query('INSERT INTO cfstep SET ?', stepData1, function(err, rows, fields) {
            if (err){
                //刪除先前已上傳的圖片
                pic='public/images/' + pic;
                    fs.unlink(pic, (err) => {
                        if (err) console.log('圖片檔尚未上傳');
                        console.log('已刪除圖片檔');
                    });		
                res.render('addFail', {});     //新增失敗
            }else{
                
                pool.query('INSERT INTO cfstep SET ?', stepData2, function(err, rows, fields) {
                    if (err){
                        //刪除先前已上傳的圖片
                        pic='public/images/' + pic;
                            fs.unlink(pic, (err) => {
                                if (err) console.log('圖片檔尚未上傳');
                                console.log('已刪除圖片檔');
                            });		
                        res.render('addFail', {});     //新增失敗
                    }else{
                        pool.query('INSERT INTO cfstep SET ?', stepData3, function(err, rows, fields) {
                            if (err){
                                //刪除先前已上傳的圖片
                                pic='public/images/' + pic;
                                    fs.unlink(pic, (err) => {
                                        if (err) console.log('圖片檔尚未上傳');
                                        console.log('已刪除圖片檔');
                                    });		
                                res.render('addFail', {});     //新增失敗
                            }else{
                                res.render('StepAddSuccess4', {memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,classFileNo:classFileNo});  //新增成功
                            }
                        });
                    }
                });
                
            }
    });
})
});

module.exports = router;

//res.render('stepAddSuccess', {});  //新增成功