
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , expressValidator = require('express-validator')
  , jobs = require('./routes/jobs')
  , users = require('./routes/users')
  , http = require('http')
  , path = require('path')
  , flash = require('connect-flash');

var app = express();

if(app.get('env') == 'development'){
  mongoose.connect(process.env.MONGOHQ_DEV);  
}else{
  mongoose.connect(process.env.MONGOHQ_PROD);
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.cookieParser());  
app.use(express.session({ secret: 'session-key'}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// routes

//-- JOB
app.get('/', jobs.index);
app.get('/jobs', jobs.index);
app.get('/jobs/new', jobs.new);
app.post('/jobs/new/preview', jobs.preview);
app.post('/jobs', jobs.create);
app.param('jobId', jobs._loadJob);
app.get('/jobs/:jobId/confirm', jobs.confirm);
app.get('/jobs/:jobId', jobs.show);
// ^\/jobs\/:jobId\/confirm\?code=[a-zA-Z0-9]*$
app.param('jobCategory', jobs._checkCategory);
app.get('/jobs/category/:jobCategory', jobs.category);

//-- USER
app.get('/users', users.index);
app.get('/users/new', users.new);
app.post('/users', users.create);
app.param('userId', users._loadUser);
app.get('/users/:userId', users.show);

// //-- Home Page
// app.get(/\/|?(jobs)?/, jobs.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
