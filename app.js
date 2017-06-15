var express = require('express');
var app = express();
var volleyball = require('volleyball');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var path = require('path');

module.exports = app;

app.set('view engine', 'html');
app.engine('html', nunjucks.render);
var env = nunjucks.configure('views', { noCache: true });
require('./filters')(env);

app.use(volleyball);
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/post', require('./routes/post'));
app.use('/bird', require('./routes/bird'));

app.get('/', function (req, res) {
   res.render('index');
});

//error handling middleware - MUST have all 4 parameters
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal Error");
});
