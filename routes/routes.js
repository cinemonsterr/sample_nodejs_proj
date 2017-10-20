const mode_switch = 'shaw';
var forever = require('forever');
const datePattern = 'yyyy-MM-dd';
const default_log_fetch_size = 100;
const exec = require('child_process').exec;
const app_path = '/home/bitnami/apps';
const git_cmd = 'sudo git pull origin ';
//const app_path = '/home/ubuntu/apps';
require('datejs');

const mongoose_options = {
	// Return the document after updates are applied
	new: true,
	// Create a document if one isn't found. Required
	// for `setDefaultsOnInsert`
	upsert: true,
	setDefaultsOnInsert: true
};

module.exports = function(app) {

	app.get('/api/listAllProcesses', function(req, res) {
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
	
	app.get('/api/getLogs/:proc_idx', function(req, res) {
		var returnVal = [];
		forever.tail(req.params.proc_idx, {length: default_log_fetch_size}, function (err, data) {
			if (err) {
				console.dir(err);
			}
			returnVal.unshift(data);
		});
		setTimeout( () => {
			//console.log(returnVal);
			res.json(returnVal);
		}, 1500);
	});
	
	app.get('/api/stopProc/:proc_idx', function(req, res) {
		forever.stop(req.params.proc_idx);
		res.json('success');
	});
	
	app.get('/api/startProc/:file', function(req, res) {
		console.log(req.params.file);
		forever.startDaemon(req.params.file, {});
		res.json('success');
	});
	
	app.get('/api/startScript', function(req, res) {
		console.log(req.query.file);
		forever.startDaemon(req.query.file, {});
		res.json('success');
	});
	
	app.get('/api/execCmd', function(req, res) {
		var cwd = req.query.cwd, cmd = git_cmd + req.query.branch;
		exec(cmd, {cwd}, (err, stdout, stderr) => {
		  if (err) {
			// node couldn't execute the command
			return;
		  }
		  res.json(stdout.split(/\n/));
		});
	});
	
	app.get('/api/getProjects', function(req, res) {
		exec('ls '+ app_path, (err, stdout, stderr) => {
		  if (err) {
			// node couldn't execute the command
			return;
		  }
		  res.json(stdout.split(/\s+/));
		});
	});
	
	app.get('/api/getScript/:project_name', function(req, res) {
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
};

