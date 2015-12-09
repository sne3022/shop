var mallApp = angular.module("MallApp", ["ngRoute",'mallController', "MallService", "ngMaterial"]);
mallApp.constant('baseUrl', '/shop/public/');

/* config -> 환경설정. routeProvide */
mallApp.config(['$routeProvider', "baseUrl", routeProvide]);

function routeProvide($routeProvider, baseUrl)
{

    $routeProvider.when("/list", {
		templateUrl: baseUrl+"template/user/list.html", 
		controller: "ItemListController" 								
    }).when("/detail/:id", {
    	templateUrl: baseUrl+"template/user/detail.html", 
		controller: "ItemDetailController" 		
    }).when("/cart", {
    	templateUrl: baseUrl+"template/user/shoppingback.html",
    	controller: "ItemShoppingbackController",
    }).when("/admin", {
        templateUrl: baseUrl+"template/admin/left_manage.html",
        controller: "AdminCtrl"
    }).
    otherwise({
    	redirectTo:'/list'
    });
}


/* 서비스 */

var mallService = angular.module("MallService", ["ngResource"]);
/* 모듈명은 fileService 를 사용할수 있는 이유는 서비스에 등록 되어있어서.*/

mallService.constant('baseUrl','/shop/public/');
mallService.$inject=["$resource","baseUrl"];

mallService.factory('mallfactory', function($resource, baseUrl){
    var resource = $resource(baseUrl+'mall/:id', {id:'@id'}, 
        {update : {method:'PUT'}
        }
    );
    return resource;  //module/:id 에서 id 의 값에 따라  @id의 값이 결정된다.
});

/* data share (controller and controller) 상품 자세히보기 */
mallService.factory('detailService', function(){
    var itemList = [];
    var count = 0;
    var addItem = function(obj)
    {
        itemList.push(obj);
    }

    var getCount = function ()
    {
        return count++;
    }

    var getItems = function()
    {
        return itemList;
    }

    var clear = function()
    {
        itemList = [];
    }

    return {
        getCount:getCount,
        addItem:addItem,
        getItems:getItems,
        clear:clear
    };
});

/* 최근 본상품 스크롤 서비스 */
mallService.factory('listService', function(){
    var itemList = [];
    var addItem = function(obj)
    {
        if(itemList.length==0) //아이템이 없을때
        {
           itemList.push(obj);
        }
        else //아이템이 존재 할때
        {   
            itemList.push(obj);
        }

        
    }

    var getItems = function()
    {
        return itemList;
    }

    var clear = function()
    {
        itemList = [];
    }

    return {
        addItem:addItem,
        getItems:getItems,
        clear:clear
    };
});

mallService.factory('optionfactory', function($resource, baseUrl){
    var resource = $resource(baseUrl+'option/:id', {id:'@id'}, 
        {update : {method:'PUT'}
        }
    );
    return resource;  //module/:id 에서 id 의 값에 따라  @id의 값이 결정된다.
});


mallService.factory('uploadfactory', function($resource, baseUrl){
    var resource = $resource(baseUrl+'upload/:id', {id:'@id'},
        {update : {method:'PUT'}
        }
    );
    return resource;  //module/:id 에서 id 의 값에 따라  @id의 값이 결정된다.
});
/* 서비스 끝 */

/* 컨트롤러 */

