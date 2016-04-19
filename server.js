var express = require('express');

var app = express();

app.use(express.static('static'));

app.get('/', function(req, res) {
	res.render('index.html');
});

app.listen(3000, function() {
	console.log('Server now listening on port 3000.');
});