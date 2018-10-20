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
var upload = multer({
  storage:storage
}).single('pic');  //表單中的檔案名稱

var startPage=1;
var linePerPage=6; 
var navSegments=10;


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
var word=req.param("word");
var stepNo=req.query.stepNo.noData;
var pic='';
console.log(word);
  // 如果有選擇圖片
if (typeof req.file != 'undefined'){
  pic=req.file.filename;   //取得上傳照片新名稱             
  
// 將更改資料
pool.query('UPDATE cfstep SET word=?,stepPic=? where classFileNo=? and stepNo=?', [word,pic,classFileNo,stepNo], function(err, rows, fields) {
  console.log(classFileNo);
  console.log(stepNo);
  if (err){				
      //刪除先前已上傳的圖片
      pic='public/images/' + pic;
      fs.unlink(pic, (err) => {
        if (err) console.log('圖片檔尚未上傳');
        console.log('已刪除圖片檔');
      });				
    res.render('memUpdateFailT', {});     //導向更改失敗頁面
  }else{
        //------------------------------------------
    
    var pageNo=parseInt(req.param('pageNo'));

    //--------------------------
    // 如果輸入參數不是數字
    //--------------------------
    if(isNaN(pageNo)){
        pageNo=1;
    }

    //--------------------------
    // 如果輸入參數小於1
    //--------------------------
    if(pageNo<1){
        pageNo=1;
    }

    //-----------------------
    // 如果點了上一個區段
    //-----------------------
    if(pageNo<startPage){
        startPage=startPage-navSegments;
    }

    //-----------------------
    // 如果點了下一個區段
    //-----------------------   
    if(pageNo>=(startPage+navSegments)){
        startPage=startPage+navSegments;
    }

    pool.query('select count(*) as cnt from class', function(err, results) {
        if (err)throw err;

        var totalLine=results[0].cnt;
        var totalPage=Math.ceil(totalLine/linePerPage);

        pool.query('select * from class limit ?, ?',[(pageNo-1)*linePerPage, linePerPage], function(err, results) {
            if (err) {
                res.render('addFail', {});
            }

            if(results.length==0){
                res.render('addFail', {});
            }else{
                var recordNo=(pageNo-1)*linePerPage+1;
                res.render('courseT', {data:results, pageNo:pageNo, totalLine:totalLine, totalPage:totalPage, startPage:startPage, linePerPage:linePerPage, navSegments:navSegments,memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,picture:req.session.picture});
            }
        }); 
    }); 
    }
  });
}else{
  // 將更改資料
  pool.query('UPDATE cfstep SET word=? where classFileNo=? and stepNo=?', [word, classFileNo,stepNo], function(err, rows, fields) {
    if (err){			
      res.render('memUpdateFailT', {});     //導向更改失敗頁面
    }else{
          //------------------------------------------
    
    var pageNo=parseInt(req.param('pageNo'));

    //--------------------------
    // 如果輸入參數不是數字
    //--------------------------
    if(isNaN(pageNo)){
        pageNo=1;
    }

    //--------------------------
    // 如果輸入參數小於1
    //--------------------------
    if(pageNo<1){
        pageNo=1;
    }

    //-----------------------
    // 如果點了上一個區段
    //-----------------------
    if(pageNo<startPage){
        startPage=startPage-navSegments;
    }

    //-----------------------
    // 如果點了下一個區段
    //-----------------------   
    if(pageNo>=(startPage+navSegments)){
        startPage=startPage+navSegments;
    }

    pool.query('select count(*) as cnt from class', function(err, results) {
        if (err)throw err;

        var totalLine=results[0].cnt;
        var totalPage=Math.ceil(totalLine/linePerPage);

        pool.query('select * from class limit ?, ?',[(pageNo-1)*linePerPage, linePerPage], function(err, results) {
            if (err) {
                res.render('addFail', {});
            }

            if(results.length==0){
                res.render('addFail', {});
            }else{
                var recordNo=(pageNo-1)*linePerPage+1;
                res.render('courseT', {data:results, pageNo:pageNo, totalLine:totalLine, totalPage:totalPage, startPage:startPage, linePerPage:linePerPage, navSegments:navSegments,memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,picture:req.session.picture});
            }
        }); 
    }); 
      }	
    })

}

});
});
module.exports = router;
