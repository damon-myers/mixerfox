module.exports = function(app, passport) {
	// home page route
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
};

// middleware function to check if a user is logged in
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();

	res.redirect();
}