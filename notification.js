const send_opt = require('./config/mail_config.json');
const forever = require('forever');
const schedule = require('node-schedule');

const checkStatus = () => {
	forever.list(false, function (err, data) {
		let to_notify = [];
		if (err) {
			console.log('Error running `forever.list()`');
			console.dir(err);
		}
		console.log('Data returned from `forever.list()`');
		data.forEach((x) => {
			if (!x.running) {
				to_notify.push({
					cwd: x.cwd.replace('/opt/','/home/'),
					file: x.file,
					pid: x.pid
				});
			}
		});
		console.dir(to_notify);
		if (to_notify.length > 0) send_mail(to_notify);
	});
};


const send_mail = (details) => {
	let failed_count = details.length;
	let content = "";
	details.forEach((x, i) => {
		content += (i+". ") + `Script: ${x.file} | Working Dir: ${x.cwd} | PID: ${x.pid}\n`;
	});
	
	let send = require('gmail-send')(Object.assign({
	  to:   'cinemonsterr@gmail.com',
	  subject: `Job failed: ${failed_count}`,
	  text:    content,         // Plain text 
	}, send_opt));
	send({}, function (err, res) {
	  console.log('send() callback returned: err:', err, '; res:', res);
	});
};

checkStatus();

var j = schedule.scheduleJob('*/15 * * * *', function(){
	console.log('check job status activated');
	checkStatus();
});
j.on('scheduled', function(runOnDate) {
	console.log(`notification job: ${runOnDate}`);
});