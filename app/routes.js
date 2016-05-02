var multer = require('multer');
var storage = multer.diskStorage({
	destination: __dirname + '/../music'
});
var upload = multer({
	storage: storage,
	limits: {
		filesize: 10000000,
		files: 12
	}
});

var fs = require('fs');
var mysql = require('mysql');
var configDB = require('../config/database.js');
var connection = mysql.createConnection(configDB.connection);

module.exports = function(app, passport) {

	// ==========================================
	//				GET
	// ==========================================

	// home page route
	app.get('/', function(req, res) {
		if(req.isAuthenticated())
			res.render('index', {
				'page':'Home',
				'loggedIn': 'true'
			});
		else
			res.render('index', {
				'page': 'Home',
				'loggedIn': false
			});
	});

	app.get('/login', function(req, res) {
		res.render('login', {
			'page':'Login',
			'login-message': req.flash('loginMessage'), 
			'signup-message': req.flash('signupMessage')
		});
	});

	app.get('/signup', function(req, res) {
		res.redirect('/login');
	});

	app.get('/create', isLoggedIn, function(req, res) {
		res.render('create', {
			'page':'Create',
			'loggedIn': true
		});
	});

	app.get('/upload', isLoggedIn, function(req, res) {
		res.render('upload', {
			'page':'Upload',
			'loggedIn': true
		});
	});

	app.get('/play', function(req, res) {
		res.render('player');
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	})

	// ==========================================
	//				POST
	// ==========================================

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}), 
	function (req, res) {
		if (req.body.remember) {
			req.session.cookie.maxAge = 1000 * 60 * 3;
		} 
		else {
			req.session.cookie.expires = false;
		}
		res.redirect('/');
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.post('/upload', isLoggedIn, upload.array('song-file'), function(req, res) {
		// insert an entry for each file into the database
		for(var fileIdx in req.files) {
			var file = req.files[fileIdx];
			connection.query('INSERT INTO song (name, path, uploader) VALUES (?, ?, ?)',
				[req.body.songName[fileIdx], file.path, req.session.passport.user]
			);
		}
		res.redirect('/upload');
	});

};

// middleware function to check if a user is logged in
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();

	res.redirect('/login');
}
