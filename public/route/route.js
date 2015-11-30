var ctrl = angular.module("MallApp",['ngMaterial']);
ctrl.constant('baseUrl', '/laravel/public/');



ctrl.provider("$buttonProvider", function($$interimElementProvider,baseUrl){
	this.$get = function(){
		return this;
	}

	defaultButton.$inject = ["$buttonProvider"];
	return $$interimElementProvider("$buttonProvider").setDefaults({
		methods:["onClick"],
		options:defaultButton,
	});

	function defaultButton($buttonProvide)
	{
		var content = "";
		return {
			onShow:onShow,
			onRemove:onRemove,
			templateUrl: baseUrl+"/template/new.html",
			template:"{%button.content%}",
			controller:function($scope){
				var self = this;
				$scope.$watch(content, function(){
					self.content = content;
				})
			},
			controllerAs:"button",

		}
		
		function onShow(scope,element,options,controller)
		{
			content = options.content;
			options.parent.append(element);
			element.css({
				color: options.color
			});

			element.click(onClick);
		}

		function onRemove(scope,element,options)
		{

		}

		function onClick(scope,element,options)
		{
			alert("test");
		}
	}
})

ctrl.directive("button", function($buttonProvider){
	return {
		restrict: "E",
		link: function(scope,element,attr){

		}
	}
})

ctrl.directive("buttonContainer", function($buttonProvider, baseUrl){
	return {
		restrict: "E",
		link: function(scope,element,attr){
			$buttonProvider.show({
				parent:element,
				content:"test2",
				color:"red"
			});
		}
	}
})

/*ctrl.controller("buttonController", function($scope,$buttonProvider){
	 $buttonProvider.show();
})*/

/*
ctrl.directive("button", function(){
	return {
		restrict: "E",
		controller: function($scope, $element, $buttonProvider){
			$scope.buttonclick = $buttonProvider.buttonclick;
			$buttonProvider.setButton($element);
		}
	}
}).provider("$buttonProvider", function(){
	this.$get = function(){
		return this;
	}

	this.buttonclick = function(){
		alert("test");
	}

	this.setButton = function($element){
		$element.css({background:"red",
			color:"white"
		})
	}

	this.newButton = function($scope, $compile){
		var newButton = $compile( //디렉티브 생성할때 compile을 해줘야 정상작동. 
			$("<button ng-click='buttonclick()'>button</button>"))($scope);
		return newButton;
	}
})

ctrl.directive("button2",function(){
	return {
		restrict: "E",
		controller: function($scope, $element, $buttonProvider){
			$scope.buttonclick = $buttonProvider.buttonclick;
			$buttonProvider.setButton($element);
		}
	}
})

ctrl.directive("buttonContainer", function($compile){
	return{
		restrict: 'E',
		transclude: true,
		template: "<div ng-transclude></div>",
		controller: function($scope, $element, $buttonProvider){
			$scope.newButton = function(){
				var button = $buttonProvider.newButton($scope,$compile);
				$element.append(button);
			}
		}
	}
})

ctrl.directive("validation", function($validationProvider){
	return {
		restrict: 'A',
		controller: function($scope, $element){

		}
	}
})*/