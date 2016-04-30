module.exports = function(app, passport) {

	// ==========================================
	//				GET
	// ==========================================

	// home page route
	app.get('/', function(req, res) {
		res.render('index', {'page':'Home'});
	});

	app.get('/login', function(req, res) {
		res.render('login', {'page':'Login', 
			'login-message': req.flash('loginMessage'), 
			'signup-message': req.flash('signupMessage') });
	});

	app.get('/create', isLoggedIn, function(req, res) {
		res.render('create', {'page':'Create'});
	});

	app.get('/upload', isLoggedIn, function(req, res) {
		res.render('upload', {'page':'Upload'});
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
	}))

};

// middleware function to check if a user is logged in
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();

	res.redirect('/login');
}