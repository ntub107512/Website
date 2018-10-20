var express = require('express');
var router = express.Router();
var mysql = require('mysql');
//------------------
// 載入資料庫連結
//------------------
var pool = require('./lib/db.js');

var startPage=1;
var linePerPage=15; 
var navSegments=10;


/* GET home page. */
router.get('/', function(req, res, next) {

 //----------------------------------

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
//------------------------------------------


  var memNo=req.session.memNo;
  var classNo=req.query.classNo;
  var chooseData; 
  pool.query('select * from class where classNo=?', [classNo], function(err, results) {
    
    chooseData=results[0].choose
    console.log(chooseData)

    if(chooseData=="Vid"){
        pool.query('select count(classNo) as cnt from joinclass where memNo=? AND classNo=?', [memNo,classNo], function(err, results) {

            var countClass=results[0].cnt; //判斷是否加入過課程
            console.log("---------------------");
            console.log(countClass);
            console.log("---------------------");
            if (err){
            res.render('addFail', {});     //新增失敗
            }else if(countClass>0){
            
            pool.query('select count(*) as cnt from classfile',  function(err, results) {
            if (err)throw err;
        
            var totalLine=results[0].cnt;
            var totalPage=Math.ceil(totalLine/linePerPage);
            console.log(classNo);
        
            pool.query('select a.*,b.*,c.* from classfile a,class b,cfvid c where a.classNo=? AND b.classNo=? and c.classFileNo=a.classFileNo limit ?, ?',[classNo,classNo,(pageNo-1)*linePerPage, linePerPage], function(err, results) {
                if (err) {
                    res.render('addFail', {});
                }else{
                    console.log(results.length);
                    var recordNo=(pageNo-1)*linePerPage+1;
                    res.render('courseViewS', {data:results, pageNo:pageNo, totalLine:totalLine, totalPage:totalPage, startPage:startPage, linePerPage:linePerPage, navSegments:navSegments,memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,picture:req.session.picture,classNo:classNo});   
                }
                }); 
            });   
            }else{
            pool.query('select count(*) as cnt from classfile',  function(err, results) {
                if (err)throw err;
        
                var totalLine=results[0].cnt;
                var totalPage=Math.ceil(totalLine/linePerPage);
                console.log(classNo);
        
                pool.query('select a.*,b.*,c.* from classfile a,class b,cfvid c where a.classNo=? AND b.classNo=? and c.classFileNo=a.classFileNo limit ?, ?',[classNo,classNo,(pageNo-1)*linePerPage, linePerPage], function(err, results) {
                    if (err) {
                        res.render('addFail', {});
                    }else{
                    
                        console.log(results.length);
                        var recordNo=(pageNo-1)*linePerPage+1;
                        res.render('courseView', {data:results, pageNo:pageNo, totalLine:totalLine, totalPage:totalPage, startPage:startPage, linePerPage:linePerPage, navSegments:navSegments,memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,picture:req.session.picture,classNo:classNo});   
                    }
                }); 
            });   
        
            }
            });
    }else if(chooseData=="Step"){

        pool.query('select count(classNo) as cnt from joinclass where memNo=? AND classNo=?', [memNo,classNo], function(err, results) {

            var countClass=results[0].cnt; //判斷是否加入過課程
            console.log("---------------------");
            console.log(countClass);
            console.log("---------------------");
            if (err){
            res.render('addFail', {});     //新增失敗
            }else if(countClass>0){
            
            pool.query('select count(*) as cnt from classfile',  function(err, results) {
            if (err)throw err;
        
            var totalLine=results[0].cnt;
            var totalPage=Math.ceil(totalLine/linePerPage);
            console.log(classNo);
        
            pool.query('select a.*,b.*,c.* from classfile a,class b,cfstep c where a.classNo=? AND b.classNo=? and c.classFileNo=a.classFileNo limit ?, ?',[classNo,classNo,(pageNo-1)*linePerPage, linePerPage], function(err, results) {
                if (err) {
                    res.render('addFail', {});
                }else{
                    console.log(results.length);
                    var recordNo=(pageNo-1)*linePerPage+1;
                    res.render('courseViewStepS', {data:results, pageNo:pageNo, totalLine:totalLine, totalPage:totalPage, startPage:startPage, linePerPage:linePerPage, navSegments:navSegments,memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,picture:req.session.picture,classNo:classNo});   
                }
                }); 
            });   
            }else{
            pool.query('select count(*) as cnt from classfile',  function(err, results) {
                if (err)throw err;
        
                var totalLine=results[0].cnt;
                var totalPage=Math.ceil(totalLine/linePerPage);
                console.log(classNo);
        
                pool.query('select a.*,b.* from classfile a,class b where a.classNo=? AND b.classNo=? limit ?, ?',[classNo,classNo,(pageNo-1)*linePerPage, linePerPage], function(err, results) {
                    if (err) {
                        res.render('addFail', {});
                    }else{
                    
                        console.log(results.length);
                        var recordNo=(pageNo-1)*linePerPage+1;
                        res.render('courseViewStep', {data:results, pageNo:pageNo, totalLine:totalLine, totalPage:totalPage, startPage:startPage, linePerPage:linePerPage, navSegments:navSegments,memNo:req.session.memNo, memName:req.session.memName, memTitle:req.session.memTitle,picture:req.session.picture,classNo:classNo});   
                    }
                }); 
            });   
        
            }
            });

    }
 
});


//  res.render('courseView', {classNo:classNo});
});

module.exports = router;
