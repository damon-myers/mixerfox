// This file should bootstrap the app and nothing more
// Business logic should be handled elsewhere

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var app = express();

// configure the express app
app.use(express.static(path.join(__dirname, 'static')));
app.use(favicon(path.join(__dirname, 'static', 'images', 'favicon.ico')));
app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.get('/create', function(req, res) {
	res.render('create');
});

app.get('/upload', function(req, res) {
	res.render('upload');
});

app.get('/play', function(req, res) {
	res.render('player');
});

app.listen(3000, function() {
	console.log('Server now listening on port 3000.');
});