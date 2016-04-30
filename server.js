// This file should bootstrap the app and nothing more
// Business logic should be handled elsewhere


// Require all of our packages to pass around
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var mysql = require('mysql');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

// configure and connect to our database
var configDB = require('./config/database.js');
var connectionDB = mysql.createConnection(configDB.connection);
connectionDB.connect();

// pass passport object for configuration
// require('./config/passport')(passport);

// configure the express app
app.use(express.static(path.join(__dirname, 'static')));
app.use(favicon(path.join(__dirname, 'static', 'images', 'favicon.ico')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.set('views', './views');
app.set('view engine', 'pug');


// routing handled in routes.js
// pass the app and passport object for auth
require('./app/routes.js')(app, passport);

var server = app.listen(port, function() {
	console.log('Server now listening on port ' + port);
});

// close the server properly on Ctrl+C
process.on('SIGINT', function() {
	console.log();
	connectionDB.end();
	console.log("DB connection terminated, closing server...");
	server.close(function() {
		console.log("Server closed, exiting.");
		process.exit();
	});
});