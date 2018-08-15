var express = require('express');
var router = express.Router();
var mysql = require('mysql');


/* GET home page. */
router.get('/', function(req, res, next) {
    req.session.loginPass=false;
    req.session.userNo=""; 	
    req.session.userName="";
    req.session.memTitle=""; 	 	
    res.render('index', {});  
});

module.exports = router;