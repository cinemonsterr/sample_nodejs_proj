angular.module('MonitorApp.controllers', [])
	.controller('MonitorController', ['$scope', 'dataFactory', 'NgTableParams', function($scope, dataFactory, NgTableParams) {
		let self = this;
		console.log('for monitoring running apps!');
		$scope.description = "Monitor your daemon application processes";
		$scope.processes, $scope.selectedProj;
		$scope.getProjects = () => {
			dataFactory.getProjects().then( (response) => {
				//console.log(`projects: ${response.data}`);
				$scope.projects = response.data;
			});
		};
		$scope.getScripts = () => {
			console.log($scope.selectedProj);
			dataFactory.getScripts($scope.selectedProj).then( (response) => {
				$scope.scripts = response.data;
			});
		};
		
		$scope.startScript = () => {
			dataFactory.startScript($scope.selectedScript, $scope.selectedProj).then( (response) => {
				setTimeout( () => {
					$scope.refresh();
					$scope.status = response;							
				}, 1000);
			});
		};
		
		$scope.refresh = () => {
			$scope.status = 'pending';
			dataFactory.listAllProcesses().then(function(response) {				
				$scope.processes = response.data;
				refreshTable(self, NgTableParams, $scope.processes);					
				$scope.status = 'success';
			});
			$scope.getProjects();
		};
		
		$scope.execCmd = (branch, cwd) => {
			$scope.status = 'pending';
			dataFactory.execCmd(branch, cwd).then(function(logs) {
				if (Array.isArray(logs.data)) {
                                        logs.data = logs.data.reverse();
                                }
				console.log(logs);
				$scope.logs = logs;
				$scope.status = 'success';
			});
		};
		
		$scope.tailLogs = (idx) => {
			dataFactory.tailLogs(idx).then(function(logs) {
				if (Array.isArray(logs.data)) {
                                        logs.data = logs.data.map((s,i) => (i + ". ").padStart(6, "0") +  s.line).reverse();
                                }
				//console.logs(logs);
				$scope.logs = logs.data;
			});
		};
		
		$scope.stopProc = (idx) => {
			$scope.status = 'pending';
			dataFactory.stopProc(idx).then(function(response) {
				$scope.refresh();
				$scope.status = response;
			});
		};
		
		$scope.restartProc = (idx) => {
			$scope.status = 'pending';
			dataFactory.restartProc(idx).then(function(response) {
				$scope.refresh();
				$scope.status = response;
			});
		};
		
		
		/*
		$scope.restartProc = (idx, file) => {
			$scope.status = 'pending';
			dataFactory.stopProc(idx).then(function(response) {
				dataFactory.startScript(file).then( (response) => {
					setTimeout( () => {
						$scope.refresh();
						$scope.status = response;							
					}, 1000);
				});
			});
		};
		*/
		/*
		
		
		$scope.save = (movieId) => {		
			
			var selected = $scope.movies.filter(function(movie) {
				return movie._id == movieId;
			});						
			if (selected.length == 1) {				
				selected = selected[0];
				$scope.status = 'pending';
				console.log(selected.tags, typeof selected.tags);
				selected.tags = selected.tags.split(',');
				dataFactory.save(selected).then(function(response) {
					$scope.status = response.data;
					$scope.refresh();
				});	
			}
		};
		
		*/
		$scope.refresh();
	}]);
	
function refreshTable(self, NgTableParams, dataset) {
	let procs = [];
	if (Array.isArray(dataset)) {
		dataset.forEach((proc, idx) => {
			let tmp = proc.file.split("/");
                        proc.file = tmp.pop();
                        if (tmp.length > 0) proc.cwd = tmp.join('/');
			procs.push({
				index: idx,
				uid: proc.uid,
				command: proc.command,
				cwd: proc.cwd.replace('/opt/','/home/'),
				branch: 'master',
				file: proc.file,
				created_at: new Date(proc.ctime),
				foreverPid: proc.foreverPid,
				args: proc.args,
				pid: proc.pid,
				logFile: proc.logFile,
				proc_status: proc.running?"running":"problem"
			});
		});
	}
	self.defaultConfigTableParams = new NgTableParams({}, { dataset: procs});
}
