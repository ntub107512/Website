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
var maxSize=2000*2000;  //設定最大可接受圖片大小(800K)

var upload = multer({
    storage:storage
}).array('pic',4); //表單中的檔案名稱



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
    var title=req.param("title");
    var classNo=req.query.classNo;
    var date=req.param("date");

    var pic1='';
    var word1=req.param("word1");
    var pic2='';
    var word2=req.param("word2");
    var pic3='';
    var word3=req.param("word3");
    var stepNo1=1;
    var stepNo2=2;
    var stepNo3=3;
    console.log(word2);
    console.log(word3);  
    var cfPic='';
    console.log(req.files);
	// 如果有選擇圖片
    if (typeof req.files != 'undefined'){
        
        pic1=req.files[0].filename;
        pic2=req.files[1].filename;
        pic3=req.files[2].filename;
        cfPic=req.files[3].filename;   //取得上傳照片新名稱             
    }
    //建立一個新資料物件
    var cfData={
        title:title,
        classNo:classNo,
        date:date,
        filepic:cfPic
    }
    var stepData1
    var stepData2
    var stepData3
    var fileNoData

    pool.query('INSERT INTO classfile SET ?', cfData, function(err, rows, fields) {
        console.log(cfData);
        if (err){
            res.render('addFail', {});   
              //新增失敗
        }else{
            pool.query('select * from classfile ORDER BY classFileNo DESC LIMIT 1', function(err, results) {
                fileNoData=results[0].classFileNo
                console.log(fileNoData);
            

            stepData1={
                stepPic:pic1,
                word:word1,
                classfileNo:fileNoData,
                stepNo:stepNo1
            }
            console.log(stepData1);
            stepData2={
                stepPic:pic2,
                word:word2,
                classfileNo:fileNoData,
                stepNo:stepNo2
            }
            console.log(stepData2);	
            stepData3={
                stepPic:pic3,
                word:word3,
                classfileNo:fileNoData,
                stepNo:stepNo3
            }
            console.log(stepData3);
             pool.query('INSERT INTO cfstep SET ?', stepData1, function(err, rows, fields) {
            /* console.log(pic);
                console.log(title);
                console.log(word);*/
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
                                    res.render('StepAddSuccess', {memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,fileNoData:fileNoData});  //新增成功
                                }
                            });
                        }
                    });
                    
                }
            });
            });
        }
   
    });
})
});

module.exports = router;

//res.render('stepAddSuccess', {});  //新增成功