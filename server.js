// This file should bootstrap the app and nothing more
// Business logic should be handled elsewhere

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var app = express();

app.use(express.static(path.join(__dirname, 'static')));
app.use(favicon(path.join(__dirname, 'static', 'images', 'favicon.ico')));

app.get('/', function(req, res) {
	res.render('index.html');
});

app.listen(3000, function() {
	console.log('Server now listening on port 3000.');
});