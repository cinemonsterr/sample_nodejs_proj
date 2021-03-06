const mode_switch = 'shaw';
var express = require('express');
var router = express.Router();
var forever = require('forever');
const datePattern = 'yyyy-MM-dd';
const default_log_fetch_size = 100;
const exec = require('child_process').exec;
const app_path = '/home/bitnami/apps';
const git_cmd = 'sudo git pull origin ';
const forever_start_cmd = 'forever start ';
//const app_path = '/home/ubuntu/apps';
require('datejs');

const _admin_ = 'admin';
const auth = require('../auth/auth_routes')(router, _admin_);

const mongoose_options = {
	// Return the document after updates are applied
	new: true,
	// Create a document if one isn't found. Required
	// for `setDefaultsOnInsert`
	upsert: true,
	setDefaultsOnInsert: true
};

/* GET home page. */
auth.get(_admin_)('/', function (req, res, next) {
	/*res.render('index', {
		title: 'Express'
	});*/
	console.log('lala');
	res.send('Hello World!')
});

auth.get(_admin_)('/monitor.html', function (req, res, next) {
	next();
});


auth.get(_admin_)('/api/listAllProcesses', function(req, res) {
	forever.list(false, function (err, data) {
		if (err) {
			console.log('Error running `forever.list()`');
			console.dir(err);
		}
		console.log('Data returned from `forever.list()`');
		console.dir(data);
		res.json(data);
	});
});

auth.get(_admin_)('/api/getLogs/:proc_idx', function(req, res) {
	var returnVal = [];
	forever.tail(req.params.proc_idx, {length: default_log_fetch_size}, function (err, data) {
		if (err) {
			console.dir(err);
		}
		returnVal.push(data);
	});
	setTimeout( () => {
		//console.log(returnVal);
		res.json(returnVal);
	}, 1500);
});

auth.get(_admin_)('/api/stopProc/:proc_idx', function(req, res) {
	forever.stop(req.params.proc_idx);
	res.json('success');
});

auth.get(_admin_)('/api/restartProc/:proc_idx', function(req, res) {
	forever.restart(req.params.proc_idx);
	res.json('success');
});

auth.get(_admin_)('/api/startProc/:file', function(req, res) {
	console.log(req.params.file);
	forever.startDaemon(req.params.file, {});
	res.json('success');
});

auth.get(_admin_)('/api/startScript', function(req, res) {
	console.log(req.query.file, req.query.proj);
	var filename = req.query.file.split("/").pop();
	var cwd = app_path + req.query.proj, cmd = forever_start_cmd + filename;
	console.log(`cwd = ${cwd}, cmd = ${cmd}`);
	exec(cmd, {cwd}, (err, stdout, stderr) => {
	  if (err) {
		// node couldn't execute the command
		return;
	  }
		console.log(stdout);
	  res.json(stdout.split(/\n/));
	});
	forever.startDaemon(req.query.file, {});
	res.json('success');
});

auth.get(_admin_)('/api/execCmd', function(req, res) {
	var cwd = req.query.cwd, cmd = git_cmd + req.query.branch;
	exec(cmd, {cwd}, (err, stdout, stderr) => {
	  if (err) {
		// node couldn't execute the command
		return;
	  }
		console.log(stdout);
	  res.json(stdout.split(/\n/));
	});
});

auth.get(_admin_)('/api/getProjects', function(req, res) {
	exec('ls '+ app_path, (err, stdout, stderr) => {
	  if (err) {
		// node couldn't execute the command
		return;
	  }
	  res.json(stdout.split(/\s+/));
	});
});

auth.get(_admin_)('/api/getScript/:project_name', function(req, res) {
	exec('ls '+ app_path + '/'+ req.params.project_name + '/*.js', (err, stdout, stderr) => {
	  if (err) {
		// node couldn't execute the command
		return;
	  }
	  res.json(stdout.split(/\s+/));
	  // the *entire* stdout and stderr (buffered)
	  
	  //console.log(`stderr: ${stderr}`);
	});
});

module.exports = router;

