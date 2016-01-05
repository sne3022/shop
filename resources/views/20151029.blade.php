<!DOCTYPE html>
<html>
<head>
	<title></title>

<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="{{shopPath('bower_components/angular/angular.js')}}"></script>	
<script src="{{shopPath('bower_components/angular-animate/angular-animate.js')}}"></script>
<script src="{{shopPath('bower_components/angular-material/angular-material.js')}}"></script>
<script src="{{shopPath('bower_components/angular-aria/angular-aria.js')}}"></script>
<script src="{{shopPath('bower_components/angular-route/angular-route.js')}}"></script>
<script src="{{shopPath('bower_components/angular-resource/angular-resource.js')}}"></script>
<script src="{{shopPath('bower_components/angular-material-icons/angular-material-icons.js')}}"></script>
<script src="{{shopPath('bower_components/angular-sanitize/angular-sanitize.js')}}"></script>


<script>

var ctrl = angular.module("test", ["ngRoute", "ngResource", 'testService', 'test.provider']);	
var service = angular.module("testService", ["ngResource"]);

service.factory('mallfactory', function($resource){
    var resource = $resource('/shop/public/mall/:id', {id:'@id'}, 
        {
        	update : {method:'PUT'}
        }
    );
    return resource;  //module/:id 에서 id 의 값에 따라  @id의 값이 결정된다.
});


angular.module('test.provider', []).provider('$testProvider', function()
{ //inject 주입 안됨
	
	var injector = angular.injector(['testService']);
	this.mallfactory = injector.get('mallfactory');	
	this.data = [];	

	this.$get = function() //inject 주입 됨
	{
		return this;	
	}


});

angular.module('test').config(function($testProviderProvider, $controllerProvider)
{
	$testProviderProvider.mallfactory.query().$promise.then(function(result)
	{
		$testProviderProvider.data = result;

		$controllerProvider.register('testController', testController);
	});
});
/*
ctrl.controller("testController", function($scope, $element, $testProvider){
	$scope.list = $testProvider.data;
})*/

function testController($scope, $element, $testProvider){
	$scope.list = $testProvider.data;
}

</script>

</head>
<body ng-app="test" ng-controller="testController">
	<div ng-repeat="li in list">
		{%li.p_idx%}
	</div>
</body>
</html>