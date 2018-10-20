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
        cb(null, 'public\\images\\activityImages');
    },

    filename: function (req, file, cb) {
        //將檔名前增加時間標記, 避免圖名重覆而被覆蓋. 
        cb(null, Date.now()+"--"+file.originalname);    
    }   
})

//-----------------------------------------------
// 產生multer的上傳物件
//-----------------------------------------------
var maxSize=2000*2000;  //設定最大可接受圖片大小(800K)

var upload = multer({
    storage:storage,
    limits:{ fileSize: maxSize }
}).single('picture');  //表單中的檔案名稱

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
    var className=req.param("className");
    var memNo=req.session.memNo;
    var startDate=req.param("startDate");
    console.log(startDate);
    var endDate=req.param("endDate");
    console.log(endDate);
    var describe=req.param("describe");
    var picture='';
    var choose=req.param("choose");
    console.log(choose);
	// 如果有選擇圖片
    if (typeof req.file != 'undefined'){
        picture=req.file.filename;   //取得上傳照片新名稱             
    }
    //建立一個新資料物件
    var newData={
        className:className,
        memNo:memNo,
        startDate:startDate,
        endDate:endDate,
        describes:describe,
        classPicture:picture,
        choose:choose
    }	
    
    if(choose=="Step"){
        pool.query('INSERT INTO class SET ?', newData, function(err, rows, fields) {
            if (err){
                //刪除先前已上傳的圖片
                picture='public/images/' + picture;
                    fs.unlink(picture, (err) => {
                        if (err) console.log('圖片檔尚未上傳');
                        console.log('已刪除圖片檔');
                    });		
                res.render('courseAddFail', {});     //新增失敗
            }else{
                pool.query('select * from class ORDER BY classNo DESC LIMIT 1', newData, function(err, results) {
                    classNo=results[0].classNo
                    res.render('courseAddSuccessS', {memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,picture:req.session.picture,className:className,describe:describe,classNo:classNo});  //新增成功
                });
            }
        });


    }else if(choose=="Vid"){
        pool.query('INSERT INTO class SET ?', newData, function(err, rows, fields) {
            if (err){
                //刪除先前已上傳的圖片
                picture='public/images/' + picture;
                    fs.unlink(picture, (err) => {
                        if (err) console.log('圖片檔尚未上傳');
                        console.log('已刪除圖片檔');
                    });		
                res.render('courseAddFail', {});     //新增失敗
            }else{

                pool.query('select * from class ORDER BY classNo DESC LIMIT 1', newData, function(err, results) {
                    classNo=results[0].classNo
                    res.render('courseAddSuccessV', {memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,picture:req.session.picture,className:className,describe:describe,classNo:classNo});  //新增成功
                });
            }
        });

    }
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