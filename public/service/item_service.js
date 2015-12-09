var mallService = angular.module("MallService", ["ngResource"]);
/* 모듈명은 fileService 를 사용할수 있는 이유는 서비스에 등록 되어있어서.*/

mallService.constant('baseUrl','/larvel/public/');
mallService.$inject=["$resource","baseUrl"];

mallService.factory('mallfactory', function($resource, baseUrl){
    var resource = $resource(baseUrl+'mall/:id', {id:'@id'}, 
        {update : {method:'PUT'}
        }
    );
    return resource;  //module/:id 에서 id 의 값에 따라  @id의 값이 결정된다.
});

/* data share (controller and controller) */
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

mallService.factory('optionfactory', function($resource, baseUrl){
    var resource = $resource(baseUrl+'option/:id', {id:'@id'}, 
        {update : {method:'PUT'}
        }
    );
    return resource;  //module/:id 에서 id 의 값에 따라  @id의 값이 결정된다.
});