var express = require('express');
var router = express.Router();
const _admin_ = 'admin';
const auth = require('../auth/auth_routes')(router, _admin_);

/* GET home page. */
auth.get(_admin_)('/', function (req, res, next) {
	console.log("mama");
	res.render('index', {
		title: 'Express'
	});
});


module.exports = router;

