(function(){
	var app = angular.module('resource-admin',[]);

	//Create App Controller
	app.controller('createResController',function($scope,$http){
		this.createRes = function(){
			var createResCtrl = this;
			console.log('Inside createRes: ' + createResCtrl.resName);
			$scope.resourceList.push({
				name:createResCtrl.resName,
				type:createResCtrl.resType
			});
			console.log(createResCtrl);
			$http.post('/resources/resNames', createResCtrl).success(function(createResCtrl){
				document.getElementById('successMessageResource').style.display = 'block';
				createResCtrl.resName = createResCtrl.resType = '';
			}).error(function(data) {
					console.log('Error: ' + data);
			});
		};
	});
	
	app.controller('resourceAdminController',function($scope, $http){
		this.resList = $scope.resourceList;
		console.log(this.resList);
		this.deleteResource = function(id){
			//console.log(id.resName);
			//id = "56fbf9153d4c81d4258c45b4";
			var index = -1;		
			var comArr = eval( $scope.resourceList );
			for( var i = 0; i < comArr.length; i++ ) {
				console.log('Inside for loop: ' + i);
				if( comArr[i]._id === id ) {
					index = i;
					console.log(i);
					break;
				}
			}
			if( index === -1 ) {
				alert( "Something gone wrong" );
			}
			$scope.resourceList.splice( index, 1 );
			console.log('Inside deleteResrouce: ' +id);
			$http.delete('/resources/resNames/'+id).success(function(data){
				console.log('Successfully deleted: ');
			}).error(function(data) {
				console.log('Error: ' + data);
			});
		}
		this.checkResource = function(id){
			console.log(this.resList);
			console.log(id);
			var comArr = eval( $scope.resourceList );
			console.log(comArr[id]);
			//console.log(id._id);
		}
	});
})();