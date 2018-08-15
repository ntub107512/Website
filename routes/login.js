var express = require('express');
var router = express.Router();
var mysql = require('mysql');

//------------------
// 載入資料庫連結
//------------------
var pool = require('./lib/db.js');


/* POST home page. */
router.post('/', function(req, res, next) {
    //取得使用者傳來的參數
    var login=req.param("login");
    var password=req.param("password");
    var memTitle=req.param("memTitle");

    console.log(memTitle);
    
    if(memTitle=="大學生"){
        pool.query('select * from tmember where (memNo=? and password=?) or (memEmail=? and password=?)', [login, password,login, password], function(err, rows, fields) {
            if (err){
                //如果失敗, 清除session中的資訊.
                req.session.loginPass=false;
                req.session.memNo=''; 
                req.session.tmemName='';
                req.session.memTitle='';
                req.session.picture=''; 
                res.render('loginFail', {});
            }else if(rows.length==0){
                //如果帳/密不符, 清除session中的資訊.		
                req.session.loginPass=false;
                req.session.memNo=''; 
                req.session.tmemName='';
                req.session.memTitle='';  
                req.session.picture=''; 		
                res.render('loginFail-1', {});
            }else{	
                //如果成功, 將登入者姓名記錄在session中.
                req.session.loginPass=true;
                req.session.memNo=rows[0].memNo; 
                req.session.tmemName=rows[0].tmemName; 
                req.session.memTitle=rows[0].memTitle;
                req.session.picture=rows[0].picture;
                req.session.memEmail=rows[0].memEmail;
                req.session.memPhone=rows[0].memPhone;
                req.session.memSchool=rows[0].memSchool;
                req.session.memMajor=rows[0].memMajor;   		
                res.redirect('/loginSuccessT');
            }
        });

    }else if(memTitle=="小學生"){
        pool.query('select * from smember where (memNo=? and password=?) or (memEmail=? and password=?)', [login, password,login, password], function(err, rows, fields) {
            if (err){
                //如果失敗, 清除session中的資訊.
                req.session.loginPass=false;
                req.session.memNo=''; 
                req.session.smemName='';
                req.session.memTitle='';
                req.session.spicture=''; 
                res.render('loginFail', {});
            }else if(rows.length==0){
                //如果帳/密不符, 清除session中的資訊.		
                req.session.loginPass=false;
                req.session.memNo=''; 
                req.session.smemName='';
                req.session.memTitle='';  
                req.session.spicture=''; 		
                res.render('loginFail-1', {});
            }else{	
                //如果成功, 將登入者姓名記錄在session中.
                req.session.loginPass=true;
                req.session.memNo=rows[0].memNo; 
                req.session.smemName=rows[0].smemName; 
                req.session.memTitle=rows[0].memTitle;
                req.session.spicture=rows[0].spicture;
                req.session.memEmail=rows[0].memEmail;
                req.session.memPhone=rows[0].memPhone;
                req.session.memSchool=rows[0].memSchool;
                req.session.sGrade=rows[0].sGrade;    		
                res.redirect('/loginSuccessS');
            }
        });
    }
  
});

module.exports = router;