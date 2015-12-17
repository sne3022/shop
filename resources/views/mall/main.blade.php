<!DOCTYPE html>
<html>
<head>
	<title></title>
		
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="{{url('bower_components/angular-material/angular-material.css')}}">		
<link rel="stylesheet" type="text/css" href="{{url('bower_components/bootstrap/dist/css/bootstrap.css')}}">	
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="{{url('css/mall.css')}}">
<link rel="stylesheet" type="text/css" href="{{url('css/view.css')}}">

<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
<script src="{{url('ckeditor/ckeditor.js')}}"></script>
<script src="{{url('bower_components/angular/angular.js')}}"></script>	
<script src="{{url('bower_components/angular-animate/angular-animate.js')}}"></script>
<script src="{{url('bower_components/angular-material/angular-material.js')}}"></script>
<script src="{{url('bower_components/angular-aria/angular-aria.js')}}"></script>
<script src="{{url('bower_components/angular-route/angular-route.js')}}"></script>
<script src="{{url('bower_components/angular-resource/angular-resource.js')}}"></script>
<script src="{{url('bower_components/angular-material-icons/angular-material-icons.js')}}"></script>
<script src="{{url('bower_components/angular-sanitize/angular-sanitize.js')}}"></script>

<script src="{{url('bower_components/angular-bootstrap/ui-bootstrap-tpls.js')}}"></script>
<script src="{{url('route/item_route.js')}}"></script>
<script src="{{url('controller/item_controller.js')}}"></script>
<script src="{{url('bower_components/ng-file-upload/ng-file-upload.js')}}"></script>
	
</head>
<body ng-app="MallApp">
	<!-- <div ng-view></div> -->
	<item-view></item-view>
</body>
</html>