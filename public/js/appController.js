(function(){
	var app = angular.module('app-type',[]);
	
	//Create App Controller
	app.controller('createAppController',function($scope,$http){
		this.createApp = function(){
			var createAppCtrl = this;
			$scope.applicationList.push({
				appName:createAppCtrl.appName,
				appVersion:createAppCtrl.appVersion
			});
			$http.post('/resources/appln', createAppCtrl).success(function(createAppCtrl){
				console.log('Inside success create application');
				document.getElementById('successMessageApplication').style.display = 'block';
				createAppCtrl.appName = createAppCtrl.appVersion ='';
				//console.log($scope.applicationList);
			}).error(function(data) {
					console.log('Error: ' + data);
			});
		};
	});
	
	app.controller('appController',function($scope,$http){
		this.appList = $scope.applicationList;
		this.deleteAppType = function(id){
			console.log('Inisde delete App: ' + id);
			//id = "56f4bf67e38ad34016d137e3";
			var index = -1;		
			var comArr = eval( $scope.applicationList );
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
			$scope.applicationList.splice( index, 1 );
			console.log('Inside deleteAppType: ' +id);
			$http.delete('/resources/appln/'+id).success(function(data){
				console.log('Successfully deleted: ');
				//console.log(data);
				document.getElementById('successDeleteMessageTravelType').style.display = 'block';
				setTimeout(function(){
					document.getElementById('successDeleteMessageTravelType').style.display = 'none';
				},2500);
			}).error(function(data) {
				console.log('Error: ' + data);
			});
		}
	});	
})();