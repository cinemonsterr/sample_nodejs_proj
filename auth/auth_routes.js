var passport = require('passport');
var router;




// helper methods
const handle_redirect = (req, res) => {
	var redirectTo = req.session.redirectTo ? req.session.redirectTo : "/";
	delete req.session.redirectTo;
	console.log("after authentication: ");
	console.dir(req.session, {depth: 6});
	res.redirect(redirectTo);
};

const isLoggedInAs = (role) => {
	return (req, res, next) => {
		if (req.isAuthenticated()) {
			if (hasRole(role)(req.session)) return next();
			else return done();
		}
		req.session.redirectTo = req.path;
		res.redirect("/login/facebook");
	};
};

const hasRole = (role) => {
	return (session) => {
		let roles = session.passport.user.roles;
		if (!Array.isArray(roles)) return false;
		console.log(`has ${role} role? ${(roles.indexOf(role) > -1)}`);
		return roles.indexOf(role) > -1;
	};
};

const get = (role) => {
	return (url, callback) => {
		router.get(url, isLoggedInAs(role), callback);
	};
};

const post = (role) => {
	return (url, callback) => {
		router.post(url, isLoggedInAs(role), callback);
	};
};


module.exports = (inj_router, min_role) => {
	router = inj_router;
	//******************** authentication related routes
	get(min_role)('/maincontent', function (req, res, next) {
		res.send('Logged In!')
	});

	//routes for authentication
	router.get("/login/facebook", passport.authenticate("facebook", {
		scope: "email"
	}));

	router.get("/login/facebook/return", passport.authenticate("facebook", {
		failureRedirect: "/"
	}), handle_redirect);

	router.get("/logout", function (req, res) {
		req.logout();
		res.redirect("/");
	});
	
	return {
		get,
		post
	};		
};