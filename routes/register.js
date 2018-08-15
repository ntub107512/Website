var express = require('express');
var router = express.Router();
var mysql = require('mysql');

//------------------
// 載入資料庫連結
//------------------
var pool = require('./lib/db.js');


/* POST home page. */
router.post('/', function(req, res,next) {
    
   //取得使用者傳來的參數
    var memNo=req.param("memNo");
    var memName=req.param("memName");
    var password=req.param("password");
    var memEmail=req.param("memEmail");
    var memTitle=req.param("memTitle");
    var picture="person.jpg";
    //建立一個新資料物件
    var newData={
        memNo:memNo,
        memName:memName,
        password:password,
        memEmail:memEmail,
        memTitle:memTitle,
        picture:picture
    }	
    
    if (memTitle=='大學生'){
        pool.query('INSERT INTO tmember SET ?', newData, function(err, rows, fields) {
            if (err){
                res.render('registerFail', {});     //新增失敗
            }else{
                res.render('registerSuccess', {});  //新增成功
            }
            });

    }else if(memTitle=='小學生'){
        pool.query('INSERT INTO smember SET ?', newData, function(err, rows, fields) {
            if (err){
                res.render('registerFail', {});     //新增失敗
            }else{
                res.render('registerSuccess', {});  //新增成功
            }
            });
    }


    /*pool.query('INSERT INTO tmember SET ?', newData, function(err, rows, fields) {
        if (err){
            res.render('registerFail', {});     //新增失敗
        }else{
            res.render('registerSuccess', {});  //新增成功
        }
        });*/
    })


module.exports = router;