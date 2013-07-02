
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , jobs = require('./routes/jobs')
  , users = require('./routes/users')
  , http = require('http')
  , path = require('path');

var app = express();

if(app.get('env') == 'development'){
  mongoose.connect('mongodb://igdaadmin:testpass@dharma.mongohq.com:10062/igda-dev');  
}else{
  mongoose.connect('mongodb://igdaadmin:testpass@dharma.mongohq.com:10053/igda-jobboard');
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// routes

// JOB
app.get('/', jobs.index);
app.get('/jobs', jobs.index);
app.get('/jobs/new', jobs.new);
app.post('/jobs/new/preview', jobs.preview);
app.post('/jobs', jobs.create);
app.param('jobId', jobs._loadJob);
app.get('/jobs/:jobId', jobs.show);

// USER
app.get('/users', users.index);
app.get('/users/new', users.new);
app.post('/users', users.create);
app.param('userId', users._loadUser);
app.get('/users/:userId', users.show);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
