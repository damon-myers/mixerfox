module.exports = function(app, passport) {

	// home page route
	app.get('/', function(req, res) {
		res.render('index', {'page':'Home'});
	});

	app.get('/login', function(req, res) {
		res.render('login', {'page':'Login', 'message': req.flash('loginMessage') });
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
};

// middleware function to check if a user is logged in
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();

	res.redirect();
}