(function(){
	var app = angular.module('auto-fill',[]);
	
		app.controller('AutoFillController', function($scope,$http) {
		var _selected;
		
		$scope.selected = undefined;

	  // Any function returning a promise object can be used to load values asynchronously
		$scope.ngModelOptionsSelected = function(value) {
			if (arguments.length) {
				_selected = value;
			} else {
				return _selected;
			}
		};

		$scope.modelOptions = {
			debounce: {
				default: 500,
				blur: 250
			},
			getterSetter: true
		};
	});
})();