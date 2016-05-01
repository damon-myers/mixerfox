// config/passport.js

var LocalStrategy = require('passport-local').Strategy;

// load the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var configDB = require('../config/database.js');
var connection = mysql.createConnection(configDB.connection);
connection.connect(function(err) {
	if(!err)
		console.log("Successfully connected to db");
});

module.exports = function(passport) {
	// passport sessions setup
	// needs ability to serialize and deserialize users to manage sessions

	passport.serializeUser(function(user, done) {
		done(null, user.username);
	});

	passport.deserializeUser(function(username, done) {
		connection.query("SELECT * FROM user WHERE username = ? ", [username], function (err, results) {
			done(err, results[0]);
		});
	});

	// Local signup
	passport.use(
		'local-signup',
		new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true
		},
		function (req, username, password, done) {
			// check for users whose username is the same as the username input on the form
			connection.query("SELECT * FROM user WHERE username = ?", [username], 
				function(err, results) {
					if (err)
						return done(err);
					if (results.length) {
						return done(null, false, req.flash('signupMessage', 
							'That username is already in use.'));
					}
					else {
						// if there are no users with that username, create the new user
						var newUserMySql = {
							username: username,
							firstName: req.body.firstName,
							lastName: req.body.lastName,
							password: bcrypt.hashSync(password, null, null)
						};

						var insertQuery = "INSERT INTO user (username, firstName, lastName, password) VALUES (?, ?, ?, ?)";

						connection.query(insertQuery, 
							[newUserMySql.username, newUserMySql.firstName, newUserMySql.lastName, newUserMySql.password], 
							function (err, results) {
								if(err) {
									console.log("MySQL Error when inserting new user: " + newUserMySql.username);
									console.log(err);
									return done(null, false, req.flash('signupMessage', 'DB Error.'));
								}

								newUserMySql.id = results.insertId;

								return done(null, newUserMySql);
							}
						);
					}
				}
			);
		})
	);

	// Local login

	passport.use(
		'local-login',
		new LocalStrategy({
			usernameField : 'username',
			passwordField : 'password',
			passReqToCallback: true
		},
		function(req, username, password, done) {
			connection.query("SELECT * FROM user WHERE username = ?", [username], function(err, results) {

				if (err)
					return done(err);
				if (!results.length)
					return done(null, false, req.flash('loginMessage', 'No User found with that Username.'));
				if (!bcrypt.compareSync(password, results[0].password))
					return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

				// if nothing else, we successfully logged in, return the logged in user
				return done(null, results[0]);
			});
		})
	);
};