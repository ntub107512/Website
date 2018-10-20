var express = require('express');
var router = express.Router();
//----------------------------------------------
// 載入使用權檢查
//----------------------------------------------
var authorize = require('./lib/authorize.js');
//----------------------------------------------

//------------------
// 載入資料庫連結
//------------------
var pool = require('./lib/db.js');

/* GET home page. */
router.post('/', function(req, res) {
    //------------------------------------------
    // 如尚未登入, 轉至未登入頁面
    //------------------------------------------
    if(!authorize.isPass(req)){
        res.render(authorize.illegalURL, {});
        return;
    }
    var hwAnsNo=req.query.hwAnsNo;
    var memNo=req.session.memNo;
    var feedback=req.param("feedback");
    var checks="yes";
    var hwansCount=0;
    var checkNoCount=0;
    var checkNoRate=0;
    var classNo;
    var classfileNoCnt;
    var classNoCnt;
    var classData;
    var classFileData;

    var newData={
    hwAnsNo:hwAnsNo,
    feedback:feedback
    }

    pool.query('INSERT INTO sresult SET ?', newData, function(err, results) {
        if (err)throw err;

        pool.query('UPDATE hwans SET checks=? WHERE hwAnsNo=?',[checks,hwAnsNo] , function(err, results) {
            pool.query('select count(*) as cnt1 from hwans', function(err, results) {
                if (err)throw err;
                hwansCount=results[0].cnt1;

                pool.query('select count(*) as cnt from hwans where checks="no"', function(err, results) {
                    if (err)throw err;
                    checkNoCount=results[0].cnt;

                    pool.query('SELECT count(*) AS classCnt FROM class WHERE memNo=?',[memNo],function(err, results) {
                        classNoCnt=results[0].classCnt;
                        //console.log(classNoCnt);

                        pool.query('SELECT * FROM class WHERE memNo=?',[memNo],function(err, results) {
                            classNo=results[0].classNo;
                            classData=results;
                            //console.log(classData);

                            pool.query('SELECT count(*) AS fileNoCnt FROM classfile a, class b WHERE a.classNo=? and b.memNo=? and a.classNo=b.classNo',[classNo,memNo],function(err, results) {
                                classfileNoCnt=results[0].fileNoCnt;
                                //console.log(classfileNoCnt);

                                pool.query('SELECT * FROM classfile WHERE classNo=?',[classNo],function(err, results) {
                                    classFileData=results;
                                    //console.log(classFileData);

                                    pool.query('SELECT a.*, b.*,c.classFileNo,c.classNo,d.classNo,f.*,g.* FROM hwans a, homework b, classfile c, class d,smember f,tmember g WHERE a.checks="no" and a.hwNo=b.hwNo and c.classNo=d.classNo and c.classFileNo=b.classFileNo and d.memNo=? and f.memNo=a.memNo and g.memNo=?',[memNo,memNo], function(err, results) {
                                        if (err)throw err;

                                        checkNoRate= (((hwansCount-checkNoCount)/hwansCount)*100).toFixed(2);//計算幾%
                                        res.render('careerHW', {memNo:req.session.memNo, tmemName:req.session.tmemName, memTitle:req.session.memTitle, picture:req.session.picture, data:results, checkNoCount:checkNoCount, checkNoRate:checkNoRate, classNoCnt:classNoCnt, classfileNoCnt:classfileNoCnt, classData:classData, classFileData:classFileData});
                                    }); 
                                });   
                            });   
                        });
                    });       
                });
            });       
        });
    });
});

module.exports = router;
