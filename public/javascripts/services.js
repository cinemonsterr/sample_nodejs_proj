angular.module('MonitorApp.services', [])
	.factory('dataFactory', ['$http', function($http) {
		var service = {};
		service.listAllProcesses = () => {
			return $http.get('/api/listAllProcesses');
		};
		service.tailLogs = (idx) => {
			return $http.get('/api/getLogs/' + idx);
		};
		service.stopProc = (idx) => {
			return $http.get('/api/stopProc/' + idx);
		};
		
		service.restartProc = (idx) => {
			return $http.get('/api/restartProc/' + idx);
		};
		
		service.startProc = (file) => {
			return $http.get('/api/startProc/' + file);
		};
		
		service.execCmd = (branch, cwd) => {
			return $http({
				method: 'GET',
				params: {branch, cwd},
				url: '/api/execCmd'
			});	
		};
		
		service.startScript = (file, proj) => {
			return $http({
				method: 'GET',
				params: {file, proj},
				url: '/api/startScript'
			});	
		};
		
		service.getProjects = () => {
			return $http.get('/api/getProjects');
		};
		
		service.getScripts = (selectedProj) => {
			return $http.get('/api/getScript/'+selectedProj);
		};
		
		
		
		
		return service;
	}]);