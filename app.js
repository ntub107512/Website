var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');


//-------------------------------------------------------
// 增加以下的require
//-------------------------------------------------------
var index = require('./routes/index');
var about = require('./routes/about');
var services = require('./routes/services');
var contact = require('./routes/contact');
var course = require('./routes/course');
var courseT = require('./routes/courseT');
var courseView = require('./routes/courseView');
var courseViewT = require('./routes/courseViewT');
var courseViewEdit = require('./routes/courseViewEdit');
var courseCreate = require('./routes/courseCreate');
var classVidView = require('./routes/classVidView');
var classEdit = require('./routes/classEdit');
var classVidCreate = require('./routes/classVidCreate');
var icons = require('./routes/icons');
var typography = require('./routes/typography');
var classStepView = require('./routes/classStepView');
var classStepCreate = require('./routes/classStepCreate');
var classStepCreate1 = require('./routes/classStepCreate1')
var classStepCreate2 = require('./routes/classStepCreate2')
var classStepCreate3 = require('./routes/classStepCreate3')
var classStepCreate4 = require('./routes/classStepCreate4')
var StepAddSuccess = require('./routes/StepAddSuccess')
var HomeWorkResponseSuccess = require('./routes/HomeWorkResponseSuccess')

var classStepEdit = require('./routes/classStepEdit');
var login = require('./routes/login');
var memberT = require('./routes/memberT');
var memberS = require('./routes/memberS');
var memberEditS = require('./routes/memberEditS');
var memberEditT = require('./routes/memberEditT');
var careerCourseT = require('./routes/careerCourseT');
var careerCourseS = require('./routes/careerCourseS');
var careerHW = require('./routes/careerHW');
var careerHWcorrect = require('./routes/careerHWcorrect');
var careerFav = require('./routes/careerFav');

var careerDiaryT = require('./routes/careerDiaryT');
var careerDiaryPlantT = require('./routes/careerDiaryPlantT');
var careerDiaryContentT = require('./routes/careerDiaryContentT');
var careerDiaryContentCreateT = require('./routes/careerDiaryContentCreateT');
var careerDiaryContentEditT = require('./routes/careerDiaryContentEditT');

var careerDiaryBookT = require('./routes/careerDiaryBookT');
var careerDiaryBookS = require('./routes/careerDiaryBookS');
var careerDiaryBookCreateT = require('./routes/careerDiaryBookCreateT');

var careerDiaryS = require('./routes/careerDiaryS');
var careerDiaryPlantS = require('./routes/careerDiaryPlantS');
var careerDiaryContentS = require('./routes/careerDiaryContentS');
var careerDiaryContentCreateS = require('./routes/careerDiaryContentCreateS');
var careerDiaryContentEditS = require('./routes/careerDiaryContentEditS');

var courseAdd = require('./routes/courseAdd');

var loginForm = require('./routes/loginForm');
var login = require('./routes/login');
//var loginSuccess = require('./routes/loginSuccess');

var loginSuccessT = require('./routes/loginSuccessT');
var loginSuccessS = require('./routes/loginSuccessS');

var registerForm = require('./routes/registerForm');
var register = require('./routes/register');

var diaryAdd = require('./routes/diaryAdd');

var memberUpdateT= require('./routes/memberUpdateT');
var memberUpdateS= require('./routes/memberUpdateS');

var cfVidAdd= require('./routes/cfVidAdd');

var loginYes= require('./routes/loginYes');
var logout= require('./routes/logout');
var courseJoin= require('./routes/courseJoin');

var courseJoinCancel= require('./routes/courseJoinCancel');

var courseViewS = require('./routes/courseViewS');

var careerDiary = require('./routes/careerDiary');

//var score= require('./routes/score');
var careerHWscore= require('./routes/careerHWscore');
var careerHwCourseHw= require('./routes/careerHwCourseHw');
var careerHwCourse= require('./routes/careerHwCourse');

var careerHWcorrectDetail= require('./routes/careerHWcorrectDetail');

var courseLock= require('./routes/courseLock');
var classLock= require('./routes/classLock');

var diaryUpdate = require('./routes/diaryUpdate');


var moment = require('moment');

var classUpdate = require('./routes/classUpdate');

var classVidViewT = require('./routes/classVidViewT');

var vidHW = require('./routes/vidHW');
var Tscore = require('./routes/Tscore');

var diaryBookAdd = require('./routes/diaryBookAdd');
var cfStepAdd1= require('./routes/cfStepAdd1');
var cfStepAdd2= require('./routes/cfStepAdd2');
var stepHWAdd= require('./routes/stepHWAdd');
var cfStepAdd3= require('./routes/cfStepAdd3');
var cfStepAdd4= require('./routes/cfStepAdd4');

var vidHWAdd= require('./routes/vidHWAdd');
var cfVidUpdate= require('./routes/cfVidUpdate');
var stepHW = require('./routes/stepHW');

var careerHwS= require('./routes/careerHwS');
var careerHwCourseS= require('./routes/careerHwCourseS');
var careerHWcorrectDetailS= require('./routes/careerHWcorrectDetailS');
var cfstepUpdate = require('./routes/cfstepUpdate')
//-------------------------------------------------------


var app = express();
//-----------------------------------------
// 增加使用session及uuid
//-----------------------------------------
var session=require('express-session');
var uuid=require('uuid');

app.use(session({
    genid:function(req){
        return uuid.v1();
    },
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true
}));
//-----------------------------------------

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


//-------------------------------------------------------
// 增加以下的app.use()
//-------------------------------------------------------
app.use('/index', index);
app.use('/about', about);
app.use('/services', services);
app.use('/contact', contact);
app.use('/course', course);
app.use('/courseT', courseT);
app.use('/courseView', courseView);
app.use('/courseViewT', courseViewT);
app.use('/courseViewEdit', courseViewEdit);
app.use('/courseCreate', courseCreate);
app.use('/classVidView', classVidView);
app.use('/classEdit', classEdit);
app.use('/classVidCreate', classVidCreate);
app.use('/icons', icons);
app.use('/typography', typography);
app.use('/classStepView', classStepView);
app.use('/classStepCreate', classStepCreate);
app.use('/classStepCreate1', classStepCreate1);
app.use('/classStepCreate2', classStepCreate2);
app.use('/classStepCreate3', classStepCreate3);
app.use('/classStepCreate4', classStepCreate4);
app.use('/StepAddSuccess', StepAddSuccess);
app.use('/HomeWorkResponseSuccess', HomeWorkResponseSuccess);



app.use('/classStepEdit', classStepEdit);
app.use('/login', login);
app.use('/memberT', memberT);
app.use('/memberS', memberS);
app.use('/memberEditS', memberEditS);
app.use('/memberEditT', memberEditT);
app.use('/careerCourseT', careerCourseT);
app.use('/careerCourseS', careerCourseS);
app.use('/careerHW', careerHW);
app.use('/careerHWcorrect', careerHWcorrect);
app.use('/careerFav', careerFav);

app.use('/careerDiaryT', careerDiaryT);
app.use('/careerDiaryPlantT', careerDiaryPlantT);
app.use('/careerDiaryContentT', careerDiaryContentT);
app.use('/careerDiaryContentCreateT', careerDiaryContentCreateT);
app.use('/careerDiaryContentEditT', careerDiaryContentEditT);

app.use('/careerDiaryBookT', careerDiaryBookT);
app.use('/careerDiaryBookS', careerDiaryBookS);
app.use('/careerDiaryBookCreateT', careerDiaryBookCreateT);

app.use('/careerDiaryS', careerDiaryS);
app.use('/careerDiaryPlantS', careerDiaryPlantS);
app.use('/careerDiaryContentS', careerDiaryContentS);
app.use('/careerDiaryContentCreateS', careerDiaryContentCreateS);
app.use('/careerDiaryContentEditS', careerDiaryContentEditS);

app.use('/courseAdd', courseAdd);

app.use('/loginForm',loginForm);
app.use('/login', login);
//app.use('/loginSuccess', loginSuccess);

app.use('/loginSuccessT',loginSuccessT);
app.use('/loginSuccessS',loginSuccessS);

app.use('/registerForm',registerForm);
app.use('/register',register);

app.use('/diaryAdd',diaryAdd);

app.use('/memberUpdateT',memberUpdateT);
app.use('/memberUpdateS',memberUpdateS);

app.use('/cfVidAdd',cfVidAdd);

app.use('/loginYes',loginYes);
app.use('/logout',logout);

app.use('/courseJoin',courseJoin);

app.use('/courseJoinCancel',courseJoinCancel);

app.use('/courseViewS', courseViewS);

app.use('/careerDiary', careerDiary);

//app.use('/score',score);
app.use('/careerHWscore',careerHWscore);
app.use('/careerHwCourseHw',careerHwCourseHw);
app.use('/careerHwCourse',careerHwCourse);


app.use('/careerHWcorrectDetail',careerHWcorrectDetail);

app.use('/courseLock',courseLock);
app.use('/classLock',classLock);

app.use('/diaryUpdate',diaryUpdate);

app.use('/classUpdate',classUpdate);

app.use('/classVidViewT', classVidViewT);

app.use('/vidHW', vidHW);
app.use('/Tscore', Tscore);

app.use('/diaryBookAdd',diaryBookAdd);
app.use('/cfStepAdd1',cfStepAdd1);
app.use('/cfStepAdd2',cfStepAdd2);
app.use('/stepHWAdd',stepHWAdd);
app.use('/cfStepAdd3',cfStepAdd3);
app.use('/cfStepAdd4',cfStepAdd4);

app.use('/vidHWAdd',vidHWAdd);
app.use('/cfVidUpdate',cfVidUpdate);
app.use('/stepHW',stepHW);

app.use('/careerHwS',careerHwS);
app.use('/careerHwCourseS',careerHwCourseS);
app.use('/careerHWcorrectDetailS',careerHWcorrectDetailS);
app.use('/cfstepUpdate',cfstepUpdate);
//-------------------------------------------------------


//-------------------------------------------------------
// 增加以下的function
//-------------------------------------------------------
app.locals.myDateFormat = function(date){
  return moment(date).format('YYYY-MM-DD');
};

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;

  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
