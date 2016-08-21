(function(){
	var app = angular.module('travel-type',[]);
	
	app.controller('createTravelController',function($scope,$http){
		this.createTravel = function(){
			var createTravelCtrl = this;
			console.log('Inside createTravel: ' + createTravelCtrl.travelType);
			$scope.travelTypeList.push({
				travelTypeName:createTravelCtrl.travelType,
			});
			console.log($scope.travelTypeList);
			$http.post('/resources/travelType', createTravelCtrl).success(function(createTravelCtrl){
				document.getElementById('successMessageTravelType').style.display = 'block';
				createTravelCtrl.travelType ='';
			}).error(function(data) {
				console.log('Error: ' + data);
			});
			
		};
	});
	
	app.controller('travelController',function($scope,$http){
		//console.log('Inside travel controller');
		this.travel = $scope.travelTypeList;
		//console.log(this.travel);
		//console.log($scope.travelTypeList);
		this.deleteTravelType = function(id){
			//id = "56f4bf67e38ad34016d137e3";
			var index = -1;		
			var comArr = eval( $scope.travelTypeList );
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
			$scope.travelTypeList.splice( index, 1 );
			console.log('Inside deleteBillType: ' +id);
			$http.delete('/resources/travelType/'+id).success(function(data){
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