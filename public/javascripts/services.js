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
		
		service.startProc = (file) => {
			return $http.get('/api/startProc/' + file);
		};
		
		service.getProjects = () => {
			return $http.get('/api/getProjects');
		};
		
		service.getScripts = (selectedProj) => {
			return $http.get('/api/getScript/'+selectedProj);
		};
		
		
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		};

		service.save = (data) => {
			return $http({
				method: 'POST',
				data: data,
				url: '/api/movieInfos'
			});			
		};
		
		service.del = (id) => {
			return $http.delete('/api/movieInfos/' + id);
		};
		
		return service;
	}]);