angular.module('MonitorApp.controllers', [])
	.controller('MonitorController', ['$scope', 'dataFactory', 'NgTableParams', function($scope, dataFactory, NgTableParams) {
		let self = this;
		console.log('for monitoring running apps!');
		$scope.description = "You can monitor your daemon application processes";
		$scope.processes, $scope.selectedProj;
		$scope.getProjects = () => {
			dataFactory.getProjects().then( (response) => {
				$scope.projects = response.data;
			});
		};
		$scope.getScripts = () => {
			dataFactory.getScript($scope.selectedProj).then( (response) => {
				$scope.scripts = response.data;
			});
		};
		
		$scope.startScript = () => {
			dataFactory.startProc(_app_path + $scope.selectedProj + '/' + $scope.selectedScript).then( (response) => {
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
		
		$scope.tailLogs = (idx) => {
			dataFactory.tailLogs(idx).then(function(logs) {
				//console.logs(logs);
				$scope.logs = logs;
			});
		};
		
		$scope.stopProc = (idx) => {
			$scope.status = 'pending';
			dataFactory.stopProc(idx).then(function(response) {
				$scope.refresh();
				$scope.status = response;
			});
		};
		
		$scope.restartProc = (file, idx) => {
			$scope.status = 'pending';
			dataFactory.stopProc(idx).then(function(response) {
				dataFactory.startProc(file).then( (response) => {
					setTimeout( () => {
						$scope.refresh();
						$scope.status = response;							
					}, 1000);
				});
			});
		};
		
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
			procs.push({
				index: idx,
				uid: proc.uid,
				command: proc.command,
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