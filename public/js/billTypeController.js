(function(){
	var app = angular.module('bill-type',[]);
	
	app.controller('createBillController',function($scope,$http){
		this.createBill = function(){
			//console.log(application);
			var createBillCtrl = this;
			console.log(createBillCtrl.billTypeName);
			$scope.billabelRateList.push({
				billTypeName:createBillCtrl.billTypeName,
				billRate:createBillCtrl.billRate
			});
			console.log(createBillCtrl);
			$http.post('/resources/billType', createBillCtrl).success(function(createBillCtrl){
				document.getElementById('successMessageBillRate').style.display = 'block';
				setTimeout(function(){
					document.getElementById('successMessageBillRate').style.display = 'none';
				},2500);
				createBillCtrl.billTypeName = createBillCtrl.billRate ='';
			}).error(function(data) {
				console.log('Error: ' + data);
			});
			//createBillCtrl.billTypeName = createBillCtrl.billType ='';
		};
	});
	
	app.controller('billTypeController',function($scope,$http){
		this.bill = $scope.billabelRateList;
		this.deleteBillType = function(id){
			//id = "56f4bf67e38ad34016d137e3";
			console.log('Inside deleteBillType: ' +id);
			var index = -1;		
			var comArr = eval( $scope.billabelRateList );
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
			$scope.billabelRateList.splice( index, 1 );
			$http.delete('/resources/billType/'+id).success(function(data){
				console.log('Successfully deleted: ');
				//console.log(data);
				document.getElementById('successDeleteMessageBillRate').style.display = 'block';
				setTimeout(function(){
					document.getElementById('successDeleteMessageBillRate').style.display = 'none';
				},2500);
			}).error(function(data) {
				console.log('Error: ' + data);
			});
		}
	});
})();