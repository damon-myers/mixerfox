// config/passport.js

var LocalStrategy = require('passport-local').Strategy;

// load the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var configDB = require('./database.js');
var connection = mysql.createConnection(configDB.connection);

module.exports = function(passport) {
	// passport sessions setup
	// needs ability to serialize and deserialize users to manage sessions

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(userid, done) {
		connection.query("SELECT * FROM user WHERE id = ? ", [userid], function (err, results) {
			done(err, rows[0]);
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
		function (req, username, password, firstName, lastName, done) {
			// check for users whose email is the same as the email input on the form
			connection.query("SELECT * FROM user WHERE username = ?", [username], 
				function(err, results) {
					if (err)
						return done(err);
					if (results.length) {
						return done(null, false, req.flash('signupMessage', 
							'That email is already in use.'));
					}
					else {
						// if there are no users with that email, create the new user
						var newUserMySql = {
							username: username,
							firstName: firstName,
							lastName: lastName,
							password: bcrypt.hashSync(password, null, null)
						};

						var insertQuery = "INSERT INTO users " +
							"( username, firstName, lastName, password) values (?, ?, ?, ?)";

						connection.query(insertQuery, 
							[newUserMySql.username, newUserMySql.firstName, newUserMySql.lastName, newUserMySql.password], 
							function (err, results) {
								newUserMySql.id = results.insertId;

								return done(null, newUserMySql)
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
		function(req, username, password, firstName, lastName, done) {
			connection.query("SELECT * FROM user WHERE username = ?", [username], function(err, results) {
				if (err)
					return done(err);
				if (!results.length)
					return done(null, false, req.flash('loginMessage', 'No User found with that Email.'));
				if (!bcrypt.compareSync(password, results[0].password))
					return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

				// if nothing else, we successfully logged in, return the logged in user
				return done(null, results[0]);
			});
		});
	);
};