(function(){
	var app = angular.module('svt',['ngAnimate', 'ui.bootstrap','auto-fill','bill-type','travel-type','app-type','resource-admin','app.filters','ui.filters']);
	
	//Cusotm Directive
	app.directive('dashBoard', function(){
		return{
			restrict:'E',
			templateURL:"dash-board.html"
		};
	});
	
	
	var project = [];
	var projectDashboard = [];
	var globalFliteredResource = [];
	//Schedule Request Controller
	app.controller('RequestController',function($http){
		this.request = {};
		this.addRequest = function(){
			var today = new Date();
			console.log('Inside add request');
			//project.push(this.request);
			project.push({
				"name": $('#resourceName').val(),
				"projectManager": $('#projMgr').val(),
				"client": $('#clientName').val(),
				"SO": $('#soNum').val(),
				"startDate": (new Date($('#schedule_startDate').val())).toISOString(),
				"endDate": (new Date($('#schedule_endDate').val())).toISOString(),
				"weeks": $('#length').text().split('weeks')[0].trim(),
				"days": ($('#length').text().split('and')[1].trim()).split(' ')[0],
				"city": $('#cityName').val(),
				"state": $('#stateName').val(),
				"travel": $('#travelType').val(),
				"app": $('#application').val().split(' ')[0],
				"appVersion": $('#application').val().split(' ')[1],
				"billableRate": $('#billableRate').val().slice(0,$('#billableRate').val().lastIndexOf('-')).trim(),
				"rate": $('#billableRate').val().split('-')[$('#billableRate').val().split('-').length-1].trim(),
				"resType": "SE",
				"activeFlag": $("[name='my-checkbox']").bootstrapSwitch('state'),
				"Notes": $('#notes').val(),
				"createdDate": today,
				"createdBy": "adsouza"
			});
			var thisResource = project[project.length-1];
			console.log(thisResource);
			$http.post('/resources/schedule', thisResource).success(function(thisResource){
				console.log('Inside post schedule');
				document.getElementById('successMessageApplication').style.display = 'block';
			}).error(function(data) {
				console.log('Error: ' + data);
			});
			//this.request = {};
		};
	});
	//Navigation Controller
	app.controller('navController',function($scope,$http){
		$scope.applicationList = [];
		$scope.resourceList = [];
		$scope.billabelRateList = [];
		$scope.travelTypeList = [];
		$scope.names = [];
		$scope.clients = [];
		$scope.projMgrs = [];
		$scope.soNums = [];
		$scope.travel = [];
		$scope.billableRate = [];
		$scope.applicationList = [];
		$scope.clientCity = [];
		$scope.clientState = [];
		this.tab = 'dashboard';
		this.selectTab = function(navItem){
			if($('#SubMenu1').attr('class')!=undefined){
				if($('#SubMenu1').attr('class').length==0 && navItem.indexOf('modify')==-1 &&  navItem.indexOf('new')==-1){
					//console.log('Inside second if');
					$('#adminOptions').collapse("toggle");
				}
			}
			this.tab = navItem;
			switch(navItem){
				case 'viewSchedule':
					$scope.loading = true;
					setTimeout(function(){
						$http.get('/resources/schedule').success(function(data){
							console.log('Getting resources in controller');
							for(var i=0;i<data.length;i++){
								//console.log(data.length);
								project.push(data[i]);
								//console.log(project.resource[i].DATEEndDate);
							}
							$scope.loading = false;
						}).error(function(data) {
							console.log('Error: ' + data);
						});
					},2000);
					
					break;
				case 'dashboard':
					$scope.loading = true;
					setTimeout(function(){
						$http.get('/resources/dashboard').success(function(data){
							console.log('Getting dashboard in controller');
							for(var i=0;i<data.length;i++){
								projectDashboard.push(data[i]);
							}
							$scope.loading = false;
						}).error(function(data) {
							console.log('Error: ' + data);
						});
					},2000);
					break;
				case 'scheduleRequest':
					var projectRequest = this;
					projectRequest.resource = [];
					$http.get('/resources/resNames').success(function(data){
						for(var i=0;i<data.length;i++){
							projectRequest.resource.push(data[i]);
							$scope.names[i] = projectRequest.resource[i].name;
						}
						$scope.loading = false;
					}).error(function(data) {
						console.log('Error: ' + data);
					});
					
					$http.get('/resources/pmNames').success(function(data){
						$scope.projMgrs =[];
						for(var i=0;i<data.length;i++){
							/*projectRequest.resource.push(data[i]);
							$scope.projMgrs[i] = projectRequest.resource[i].projectManager;*/
							$scope.projMgrs.push(data[i].name);
						}
						$scope.loading = false;
					}).error(function(data) {
						console.log('Error: ' + data);
					});
					$http.get('/resources/clientNames').success(function(data){
						for(var i=0;i<data.length;i++){
							/*projectRequest.resource.push(data[i]);
							$scope.clients[i] = projectRequest.resource[i].client;*/
							$scope.clients[i] = data[i].clientName;
							$scope.clientCity.push(data[i].clientCity);
							$scope.clientState.push(data[i].clientState);
						}
						$scope.loading = false;
					}).error(function(data) {
						console.log('Error: ' + data);
					});
					$http.get('/resources/travelType').success(function(data){
						$scope.travelTypeList = [];
						for(var i=0;i<data.length;i++){
							$scope.travelTypeList.push(data[i].travelTypeName);
						}
					}).error(function(data) {
						console.log('Error: ' + data);
					});
					$http.get('/resources/billType').success(function(data){
						$scope.billabelRateList = [];
						for(var i=0;i<data.length;i++){
							$scope.billabelRateList.push(data[i].billTypeName +' - '+ data[i].billRate);
						}
					}).error(function(data) {
						console.log('Error: ' + data);
					});
					$http.get('/resources/appln').success(function(data){
						$scope.applicationList =[];
						for(var i=0;i<data.length;i++){
							$scope.applicationList.push(data[i].appName + ' ' + data[i].appVersion);
						}
						//console.log($scope.applicationList);
					}).error(function(data) {
						console.log('Error: ' + data);
					});
					break;
				case 'admin':
					$http.get('/resources/appln').success(function(data){
						for(var i=0;i<data.length;i++){
							$scope.applicationList.push(data[i]);
						}
					}).error(function(data) {
						console.log('Error: ' + data);
					});
					break;
				case 'newTravel':
					$http.get('/resources/travelType').success(function(data){
						for(var i=0;i<data.length;i++){
							$scope.travelTypeList.push(data[i]);
						}
					}).error(function(data) {
						console.log('Error: ' + data);
					});
					break;
				case 'newBill':
					$http.get('/resources/billType').success(function(data){
						for(var i=0;i<data.length;i++){
							$scope.billabelRateList.push(data[i]);
						}
					}).error(function(data) {
						console.log('Error: ' + data);
					});
					break;
				case 'newResource':	
					$http.get('/resources/resNames').success(function(data){
						for(var i=0;i<data.length;i++){
							//$scope.resourceList.push({'resName':data[i].name,'resType':data[i].type});
							$scope.resourceList.push(data[i]);
						}
					}).error(function(data) {
						console.log('Error: ' + data);
					});
					break;
				case 'modifyResource':
					$http.get('/resources/resNames').success(function(data){
						for(var i=0;i<data.length;i++){
							//$scope.resourceList.push({'resName':data[i].name,'resType':data[i].type});
							$scope.resourceList.push(data[i]);
						}
					}).error(function(data) {
						console.log('Error: ' + data);
					});
					break;
			}
		};
		this.isSelected = function(checkTab){
			return this.tab === checkTab;
		}
	});
	
	//Resource Controller
	app.controller('resourceController',function($scope, $uibModal, $log, $http){
		$scope.filteredResource = [];
		$scope.resource = project;
		$scope.orderByField = 'name';
		$scope.search = {name:'', projectManager:''};
		$scope.reverseSort = false;
		$scope.selectedRow = null;  // initialize our variable to null
		$scope.setClickedRow = function(clickedResource){  //function that sets the value of selectedRow to current index
			$scope.selectedRow = clickedResource;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				resolve: {
					selectedRow: function () {
						return $scope.selectedRow;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
					$scope.selected = selectedItem;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
			});
		};

		this.selectRadio = function(radioItem){
			$scope.selectRadioItem = radioItem;
		}
		this.whatsChecked = function(selectedRadio){
			return $scope.selectRadioItem === selectedRadio;
		}
		
		$('#filter').on('mousedown',function($scope){
			var startDate = new Date($('#startDate').val());
			startDate.setDate(startDate.getDate());
			var endDate = new Date($('#endDate').val());
			endDate.setDate(endDate.getDate());
			startDate = startDate.toISOString().replace('T07','T00');
			endDate = endDate.toISOString().replace('T07','T00');
			
			if($('input[name="optradioStart"]:checked').val() == "betweenStartDate" && $('input[name="optradioStart"]:checked').val() == "betweenEndDate"){
				var startDate2 = new Date($('#startDate_2').val());
				startDate2.setDate(startDate2.getDate());
				var endDate2 = new Date($('#endDate_2').val());
				endDate2.setDate(endDate2.getDate());
				startDate2 = startDate2.toISOString().replace('T07','T00');
				endDate2 = endDate2.toISOString().replace('T07','T00');
				if((startDate != "Invalid Date" && endDate != "Invalid Date" && startDate2 != "Invalid Date" && endDate2 != "Invalid Date") && (startDate.length==0||startDate.length==24||endDate.length==0&&endDate.length==24||startDate2.length==0||startDate2.length==24||endDate2.length==0&&endDate2.length==24)){
					$http.get('/resources/filteredSchedule',{
						params:{
							"startFilter":$('input[name="optradioStart"]:checked').val(),
							"endFilter":$('input[name="optradioEnd"]:checked').val(),
							"startVal": startDate,
							"endVal": endDate,
							"startVal2": startDate2,
							"endVal2": endDate2
						}
					}).success(function(data){
						console.log('Getting filtered resources in controller');
						if(data.length==0){
							globalFliteredResource.push({'name':'No Results','client':'No Results','SO':'No results','startDate':$('#startDate').val(),'endDate':$('#endDate').val(),'city':'No Results','state':'No Results','travel':'No Results','projectManager':'No Results'});
						}
						for(var i=0;i<data.length;i++){
							globalFliteredResource.push(data[i]);
						}
						$scope.loading = false;
					}).error(function(data) {
						console.log('Error: ' + data);
					});
				}
			}
			else if($('input[name="optradioStart"]:checked').val() == "betweenStartDate" && $('input[name="optradioStart"]:checked').val() != "betweenEndDate"){
				var startDate2 = new Date($('#startDate_2').val());
				startDate2.setDate(startDate2.getDate());
				startDate2 = startDate2.toISOString().replace('T07','T00');
				if((startDate != "Invalid Date" && endDate != "Invalid Date" && startDate2 != "Invalid Date") && (startDate.length==0||startDate.length==24||endDate.length==0&&endDate.length==24||startDate2.length==0||startDate2.length==24)){
					$http.get('/resources/filteredSchedule',{
						params:{
							"startFilter":$('input[name="optradioStart"]:checked').val(),
							"endFilter":$('input[name="optradioEnd"]:checked').val(),
							"startVal": startDate,
							"endVal": endDate,
							"startVal2": startDate2,
						}
					}).success(function(data){
						console.log('Getting filtered resources in controller');
						if(data.length==0){
							globalFliteredResource.push({'name':'No Results','client':'No Results','SO':'No results','startDate':$('#startDate').val(),'endDate':$('#endDate').val(),'city':'No Results','state':'No Results','travel':'No Results','projectManager':'No Results'});
						}
						for(var i=0;i<data.length;i++){
							globalFliteredResource.push(data[i]);
						}
						$scope.loading = false;
					}).error(function(data) {
						console.log('Error: ' + data);
					});
				}
			}
			else if($('input[name="optradioStart"]:checked').val() != "betweenStartDate" && $('input[name="optradioStart"]:checked').val() == "betweenEndDate"){
				var endDate2 = new Date($('#endDate_2').val());
				endDate2.setDate(endDate2.getDate());
				endDate2 = endDate2.toISOString().replace('T07','T00');
				if((startDate != "Invalid Date" && endDate != "Invalid Date" && endDate2 != "Invalid Date") && (startDate.length==0||startDate.length==24||endDate.length==0&&endDate.length==24||endDate2.length==0||endDate2.length==24)){
					$http.get('/resources/filteredSchedule',{
						params:{
							"startFilter":$('input[name="optradioStart"]:checked').val(),
							"endFilter":$('input[name="optradioEnd"]:checked').val(),
							"startVal": startDate,
							"endVal": endDate,
							"startVal2": startDate2,
							"endVal2": endDate2
						}
					}).success(function(data){
						console.log('Getting filtered resources in controller');
						if(data.length==0){
							globalFliteredResource.push({'name':'No Results','client':'No Results','SO':'No results','startDate':$('#startDate').val(),'endDate':$('#endDate').val(),'city':'No Results','state':'No Results','travel':'No Results','projectManager':'No Results'});
						}
						for(var i=0;i<data.length;i++){
							globalFliteredResource.push(data[i]);
						}
						$scope.loading = false;
					}).error(function(data) {
						console.log('Error: ' + data);
					});
				}
			}
			else if($('input[name="optradioStart"]:checked').val() != "betweenStartDate" && $('input[name="optradioStart"]:checked').val() != "betweenEndDate"){
				if(startDate.length==0||startDate.length==24||endDate.length==0&&endDate.length==24){
					$http.get('/resources/filteredSchedule',{
						params:{
							"startFilter":$('input[name="optradioStart"]:checked').val(),
							"endFilter":$('input[name="optradioEnd"]:checked').val(),
							"startVal": startDate,
							"endVal": endDate
						}
					}).success(function(data){
						console.log('Getting filtered resources in controller');
						if(data.length==0){
							globalFliteredResource.push({'name':'No Results','client':'No Results','SO':'No results','startDate':$('#startDate').val(),'endDate':$('#endDate').val(),'city':'No Results','state':'No Results','travel':'No Results','projectManager':'No Results'});
						}
						for(var i=0;i<data.length;i++){
							globalFliteredResource.push(data[i]);
						}
						$scope.loading = false;
					}).error(function(data) {
						console.log('Error: ' + data);
					});
				}
				else{
					console.log('Invalid Date');
				}
			}
		})
	});
	
	angular.module('app.filters', []).filter('tableFilter', [function () {
		return function (resource, filteredResource) {
			$('#filter').on('mousedown',function($scope){
				console.log('Inside tableFilter: ' + document.getElementById('filterLoading').style.display);

				/*if(filteredResource.length==0){
				var startDate = new Date($('#startDate').val());
				startDate.setDate(startDate.getDate()-1);
				var endDate = new Date($('#endDate').val());
				endDate.setDate(endDate.getDate()-1);
				if(startDate!='Invalid Date' && $('#startDate').val().length==10 && $('#endDate').val().length==0){
					var findRow = false;
					for(var i=0;i<resource.length;i++){
						var rowDate = new Date(resource[i].startDate.split('T')[0]);
						rowDate.setHours(0,0,0,0);
						if($('input[name="optradioStart"]:checked').val() == 'beforeStartDate'){
							if(startDate.valueOf() > rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + startDate + resource.length);
							}
						}
						else if($('input[name="optradioStart"]:checked').val() == 'afterStartDate'){
							if(startDate.valueOf() < rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + startDate + resource.length);
							}
						}
						else if($('input[name="optradioStart"]:checked').val() == 'onStartDate'){
							if(startDate.valueOf() === rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + startDate + resource.length);
							}
						}
						else if($('input[name="optradioStart"]:checked').val() == 'betweenStartDate'){
							var startDate_2 = new Date($('#startDate_2').val());
							startDate_2.setDate(startDate_2.getDate()-1);
							if(startDate.valueOf() < rowDate.valueOf() && startDate_2.valueOf() > rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + startDate + resource.length);
							}
						}
						if(i== resource.length-1){
							if(findRow==false){
								filteredResource.push({'name':'No Results','client':'No Results','SO':'No results','startDate':$('#startDate').val(),'endDate':$('#endDate').val(),'city':'No Results','state':'No Results','travel':'No Results','projectManager':'No Results'});
							}
						}
					}
				}
				else if(endDate!='Invalid Date' && $('#startDate').val().length==0 && $('#endDate').val().length==10){
					var findRow = false;
					for(var i=0;i<resource.length;i++){
						var rowDate = new Date(resource[i].endDate.split('T')[0]);
						rowDate.setHours(0,0,0,0);
						if($('input[name="optradioEnd"]:checked').val() == 'beforeEndDate'){
							if(endDate.valueOf() > rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'afterEndDate'){
							if(endDate.valueOf() < rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'onEndDate'){
							if(endDate.valueOf() === rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'betweenEndDate'){
							var endDate_2 = new Date($('#endDate_2').val());
							endDate_2.setDate(endDate_2.getDate()-1);
							if(endDate.valueOf() < rowDate.valueOf() && endDate_2.valueOf() > rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						if(i== resource.length-1){
							if(findRow==false){
								filteredResource.push({'name':'No Results','client':'No Results','SO':'No results','startDate':$('#startDate').val(),'endDate':$('#endDate').val(),'city':'No Results','state':'No Results','travel':'No Results','projectManager':'No Results'});
							}
						}
					}
				}
				else if(endDate!='Invalid Date' && $('#startDate').val().length==10 && $('#endDate').val().length==10){
					var findRow = false;
					for(var i=0;i<resource.length;i++){
						var rowDate = new Date(resource[i].endDate.split('T')[0]);
						rowDate.setHours(0,0,0,0);
						if($('input[name="optradioEnd"]:checked').val() == 'beforeEndDate' && $('input[name="optradioStart"]:checked').val() == 'beforeStartDate'){
							if(endDate.valueOf() > rowDate.valueOf() && startDate.valueOf() > rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'beforeEndDate' && $('input[name="optradioStart"]:checked').val() == 'onStartDate'){
							if(endDate.valueOf() > rowDate.valueOf() && startDate.valueOf() === rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'beforeEndDate' && $('input[name="optradioStart"]:checked').val() == 'afterStartDate'){
							if(endDate.valueOf() > rowDate.valueOf() && startDate.valueOf() > rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'beforeEndDate' && $('input[name="optradioStart"]:checked').val() == 'betweenStartDate'){
							var startDate_2 = new Date($('#startDate_2').val());
							startDate_2.setDate(startDate_2.getDate()-1);
							if(endDate.valueOf() > rowDate.valueOf() && startDate.valueOf() < rowDate.valueOf() && startDate_2.valueOf() > rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'afterEndDate' && $('input[name="optradioStart"]:checked').val() == 'afterStartDate'){
							if(endDate.valueOf() < rowDate.valueOf() && startDate.valueOf() < rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'afterEndDate' && $('input[name="optradioStart"]:checked').val() == 'beforeStartDate'){
							if(endDate.valueOf() < rowDate.valueOf() && startDate.valueOf() > rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'afterEndDate' && $('input[name="optradioStart"]:checked').val() == 'onStartDate'){
							if(endDate.valueOf() < rowDate.valueOf() && startDate.valueOf() === rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'afterEndDate' && $('input[name="optradioStart"]:checked').val() == 'betweenStartDate'){
							var startDate_2 = new Date($('#startDate_2').val());
							startDate_2.setDate(startDate_2.getDate()-1);
							if(endDate.valueOf() < rowDate.valueOf() && startDate.valueOf() < rowDate.valueOf() && startDate_2.valueOf() > rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'onEndDate' && $('input[name="optradioStart"]:checked').val() == 'onStartDate'){
							if(endDate.valueOf() === rowDate.valueOf() && startDate.valueOf() === rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'onEndDate' && $('input[name="optradioStart"]:checked').val() == 'beforeStartDate'){
							if(endDate.valueOf() === rowDate.valueOf() && startDate.valueOf() > rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'onEndDate' && $('input[name="optradioStart"]:checked').val() == 'afterStartDate'){
							if(endDate.valueOf() === rowDate.valueOf() && startDate.valueOf() < rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'onEndDate' && $('input[name="optradioStart"]:checked').val() == 'betweenStartDate'){
							var startDate_2 = new Date($('#startDate_2').val());
							startDate_2.setDate(startDate_2.getDate()-1);
							if(endDate.valueOf() === rowDate.valueOf() && startDate.valueOf() < rowDate.valueOf() && startDate_2.valueOf() > rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'betweenEndDate' && $('input[name="optradioStart"]:checked').val() == 'betweenStartDate'){
							var startDate_2 = new Date($('#startDate_2').val());
							startDate_2.setDate(startDate_2.getDate()-1);
							var endDate_2 = new Date($('#endDate_2').val());
							endDate_2.setDate(endDate_2.getDate()-1);
							if(endDate.valueOf() < rowDate.valueOf() && endDate_2.valueOf() > rowDate.valueOf() && startDate.valueOf() < rowDate.valueOf() && startDate_2.valueOf() > rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'betweenEndDate' && $('input[name="optradioStart"]:checked').val() == 'beforeStartDate'){
							var endDate_2 = new Date($('#endDate_2').val());
							endDate_2.setDate(endDate_2.getDate()-1);
							if(endDate.valueOf() < rowDate.valueOf() && endDate_2.valueOf() > rowDate.valueOf() && startDate.valueOf() > rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'betweenEndDate' && $('input[name="optradioStart"]:checked').val() == 'afterStartDate'){
							var endDate_2 = new Date($('#endDate_2').val());
							endDate_2.setDate(endDate_2.getDate()-1);
							if(endDate.valueOf() < rowDate.valueOf() && endDate_2.valueOf() > rowDate.valueOf() && startDate.valueOf() < rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'betweenEndDate' && $('input[name="optradioStart"]:checked').val() == 'onStartDate'){
							var endDate_2 = new Date($('#endDate_2').val());
							endDate_2.setDate(endDate_2.getDate()-1);
							if(endDate.valueOf() < rowDate.valueOf() && endDate_2.valueOf() > rowDate.valueOf() && startDate.valueOf() === rowDate.valueOf()){
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						if(i== resource.length-1){
							if(findRow==false){
								filteredResource.push({'name':'No Results','client':'No Results','SO':'No results','startDate':$('#startDate').val(),'endDate':$('#endDate').val(),'city':'No Results','state':'No Results','travel':'No Results','projectManager':'No Results'});
							}
						}
					}
				}
			  }
			  else if($('#startDate').val().length==0 && $('#endDate').val().length==0){
				for(var i=0; i<filteredResource.length; i++)
					filteredResource.pop();
			  }
			  */
			  
			  
			  if($('#startDate').val().length==0 && $('#endDate').val().length==0){
				for(var i=0; i<filteredResource.length; i++)
					filteredResource.pop();
			  }
		    });
			$('#reset').on('click',function(){
				$('#startDate').val("");
				$('#endDate').val("");
				globalFliteredResource = [];
		    });
			
			filteredResource = Array.from(globalFliteredResource);
			
			setTimeout(function(){$('#filterLoading').hide()},1500);
			if(!angular.isUndefined(resource) && !angular.isUndefined(filteredResource) && filteredResource.length > 0) {
				console.log('Displaying Filtered Resource: ' + filteredResource.length);
				return filteredResource;
			} else {
				console.log('Displaying Complete Resource');
				return resource;
			}
		};
	}]);
	
	app.controller('dashboardController',function($scope, $uibModal, $log, $http){
		this.resource = projectDashboard;
		//$scope.loading = true;
		//setTimeout(function(){
		$http.get('/resources/dashboard').success(function(data){
			console.log('Getting dashboard in controller');
			for(var i=0;i<data.length;i++){
				projectDashboard.push(data[i]);
				//console.log(project.resource[i].DATEEndDate);
			}
			$scope.loading = false;
			}).error(function(data) {
				console.log('Error: ' + data);
			});
		//},2000);
		$scope.orderByField = 'name';
		$scope.reverseSort = false;
		$scope.selectedRow = null;  // initialize our variable to null
		$scope.setClickedRow = function(clickedResource){  //function that sets the value of selectedRow to current index
			//console.log(clickedResource);
			$scope.selectedRow = clickedResource;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				resolve: {
					selectedRow: function () {
						return $scope.selectedRow;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
					$scope.selected = selectedItem;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
			});
		};
	});
	
	//Modal Controller
	app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, selectedRow) {
		$scope.selectedRow = selectedRow;
		$scope.selected = {
			selectedRow: $scope.selectedRow
		};
		$scope.ok = function () {
			$uibModalInstance.close($scope.selected.item);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
})();


$(document).ready(function() {
    $('.date').datepicker({
		format: 'mm.dd.yyyy',
	});
	
	/*$('.date').datepicker().on('changeDate',function(){
		$('#schedule_startDate').change();
	});*/
	
	$('#schedule_endDate').change(function () {
		console.log($('#schedule_endDate').val());
		var dt1 =  new Date($('#schedule_endDate').val()),dt2 = new Date($('#schedule_startDate').val());
		if(dt1 && dt2){  
			var mil = Math.floor(dt1 - dt2);
			  
			var seconds = (mil / 1000) | 0;
			mil -= seconds * 1000;

			var minutes = (seconds / 60) | 0;
			seconds -= minutes * 60;

			var hours = (minutes / 60) | 0;
			minutes -= hours * 60;

			var days = (hours / 24) | 0;
			hours -= days * 24;

			var weeks = (days / 7) | 0;
			days -= weeks * 7;
			console.log("weeks:"+weeks+",days:"+days+",hours:"+hours+",minutes:"+minutes+",seconds:"+seconds);
			document.getElementById('length').innerText = weeks + " weeks and " + days + " days";
		}else{
		  return err;
		}
	});
	
	$('#filter').on('mouseover',function(){
		$('#filterLoading').show();
	});
});
			  
$('.parent').click(function() {
    var subMenu = $(this).siblings('ul');
    if ($(subMenu).hasClass('open')) {
        $(subMenu).fadeOut();
        $(subMenu).removeClass('open').addClass('closed');
    }
    else {
        $(subMenu).fadeIn();
        $(subMenu).removeClass('closed').addClass('open');
    }
});