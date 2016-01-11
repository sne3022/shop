var mall = angular.module('mallController', ['ui.bootstrap', 'ngMaterial', 'ngFileUpload', 'ngSanitize']);
mall.$inject = ["$scope","$routeParams","configService","mallfactory", 
                "optionfactory", "detailService", "listService", 
                "Upload", "uploadfactory", "categoryfactory"];

mall.controller("AdminCtrl", function($scope){
	
	$scope.itemEditList = null;
	$scope.optionEditList = null;
	$scope.optionInsertList = null;
	$scope.fileName = null;
	$scope.normal = 'manage';
	$scope.control = function(number){

		if(number==0)
		{
			CKEDITOR.remove('contents');
			$scope.normal = 'category';
		}
		else if(number==1)
		{
			CKEDITOR.remove('contents');
			$scope.normal = 'insert';  
		}
		else if(number==2)
		{
			CKEDITOR.remove('contents');
			$scope.normal = 'manage';
		}
		else if(number==3)
		{
			$scope.normal = "setting";
		}
		else if(number==4)
		{
			CKEDITOR.remove('contents');
			$scope.normal = "optionedit";
		}

		else if(number==5)
		{
			CKEDITOR.remove('contents');
			$scope.normal = "optioninsert";
		}
	}

})

/******************************************* 상품 리스트 ***************************************/
mall.controller("ItemListController", function($scope, mallfactory, listService, categoryfactory)
{
	$scope.totalItemNumber = 0; //상품 총개수 초기화
    $scope.itemperpage = 9; //페이지당 상품 표시 개수
    $scope.currentPage = 1; //현재 페이지 표시
    $scope.items =[]; //상품을 담는 공간

    getItems(); //상품 가져오기 
    getMenu();

    function getMenu()
    {
    	categoryfactory.query().$promise.then(function(result){
    		$scope.menuList = result;
    	})
    	/*$scope.menuList = ['ABOUT', 'COMPANY', 'CONTACT', 'NOTICE'];*/
    }

    /* 상품 가져오기 Pagination */
	function getItems()
    {   

    	/* 상품 가져오는 쿼리문 */ 
        mallfactory.query().$promise.then(function(result)
        { 
	        $scope.totalItemNumber = result.length; //아이탬 총 개수
	        $scope.items = result; 
	        $scope.startItem = ($scope.currentPage -1) * $scope.itemperpage;
	        $scope.endItem = $scope.startItem + $scope.itemperpage;
	        $scope.totalItems = $scope.items.slice($scope.startItem, $scope.endItem);   
        })

       if(listService.getItems().length!=0)
	   {
			$scope.imgList = listService.getItems();
	   }
    }

    /* 페이지 이동 */
    $scope.pageChanged = function() 
	{   
	        $scope.startItem = ($scope.currentPage -1) * $scope.itemperpage;  
	        $scope.endItem = $scope.startItem + $scope. itemperpage; 
	        $scope.totalItems = $scope.items.slice($scope.startItem, $scope.endItem) 
	}

	/* 상품 장바구니 이동*/
	$scope.pocketList = function()
	{
		location.href="#/cart";
	}

	$scope.mouseenter = function(event)
	{
		id = $(event.currentTarget).attr('id');
		$("."+id).show();
	}

	$scope.mouseleave = function(event)
	{
		id = $(event.currentTarget).attr('id');
		$("."+id).hide();
	}

	$scope.detail = function(img,code)
	{	
		$scope.recentlyViewList = {
			img:img,
			code:code
		};
		listService.addItem($scope.recentlyViewList);
	}


})


/******************************************* 상품 자세히 보기 ***************************************/
mall.controller("ItemDetailController", function($scope, $routeParams, mallfactory, optionfactory, detailService, $sce, uploadfactory)
{	
 		
	$scope.optionList = []; //상품 옵션을 담을 공간
	$scope.user = [];
	$scope.o_totalMoney = 0;
	$scope.trustAsHtml = function(html) 
    {
      return $sce.trustAsHtml(html);
    }


 	
	mallfactory.get({id:$routeParams.id}).$promise.then(function(result)
	{					
		$scope.item = result; //전체 상품 정보
		$scope.idx = $scope.item.p_idx; //상품 idx
		$scope.code = $scope.item.p_code; //상품 코드
		$scope.sImg = []; //작은 이미지 정보 담을 공간
		$scope.bImg = $scope.item.p_big_img; //큰 이미지 정보
		$scope.contents = $scope.item.p_contents; //상품 설명
		$scope.quantity =1; //수량 초기값
		$scope.totalQuantity = $scope.item.p_quantity; //상품 수량

		$scope.title = $scope.item.p_title; //상품 타이틀
		$scope.o_price = $scope.item.p_price; //옵션 가격
		$scope.d_price = $scope.item.p_price; //상품 가격
		$scope.d_totalMoney = $scope.item.p_price; //상품총가격 초기값
		$scope.origin_price = $scope.item.p_price; //상품 기본 가격

		
		 uploadfactory.get({id:$scope.item.p_small_img}).$promise.then(function(result)
		 {
	            result.forEach(function(result)
	            {
	               $scope.sImg.push('../'+result.file_path + '/' + result.file_name);
	            })
	     })

		optionfactory.query({id:$routeParams.id}).$promise.then(function(result)
		{
			// 옵션 데이터 사이즈 설정 
			$scope.optionList = result; 
			$scope.selectedOption =[]; //옵션 추가
			$scope.sizeList = []; //옵션의 내용 추가


			//옵션 기능 있는지 확인
			$scope.optionList = $.grep($scope.optionList, function(option)
			{
				if(option.o_field_name=='옵션'&&option.o_all_status=='y') //옵션 존재 + 사용 y  
				{ 
					$scope.selectedOption.push(option); //옵션 넣기 
					$scope.option_price = Number(option.o_value); //옵션값 정수 변환
					$scope.o_price += $scope.option_price; //옵션이 있으면 기본값 + 옵션값

					var str = option.o_select_box; //옵션 기능 값
					arr = str.split(",");
					$scope.sizeList.push(arr);
					$scope.optionUse='y';	
				}
				else if(option.o_field_name!='옵션'&& option.o_all_status=='y') //옵션 x + 사용 뮤무 y 
				{
					return true;
				}
			})
			
		})
	}); 

	/* 작은 이미지 == 큰 이미지 교환 */	
	$scope.imgChange = function(img)
	{ 
		$scope.bImg = img;
	}

	/* 수량 증가버튼 */
	$scope.quantityUp = function(total_price)
	{
		if($scope.quantity >=$scope.totalQuantity)
		{
			alert("최대 "+$scope.totalQuantity+"개 입니다.");
			$scope.quantity = $scope.totalQuantity; //(상품 총 수량)
			return false;
		}
		$scope.quantity +=1; //(수량 = 수량 + 1)
		$scope.o_price = total_price+$scope.origin_price+$scope.option_price;//(총가격=총가격+단가+옵션)
		$scope.d_price = total_price+$scope.origin_price;
		$scope.o_totalMoney = total_price+$scope.origin_price+$scope.option_price;
		$scope.d_totalMoney = total_price+$scope.origin_price;
	} 

	/* 수량 감소버튼 */ 
	$scope.quantityDown = function(total_price)
	{ 

		if($scope.quantity <=1)
		{
			alert("최소 1개이상입니다.");
			return false;
		}
		$scope.quantity -=1;
		$scope.o_price = total_price-$scope.origin_price-$scope.option_price; //(총가격= 총가격-단가-옵션)
		$scope.d_price = total_price-$scope.origin_price;
		$scope.o_totalMoney = total_price-$scope.origin_price-$scope.option_price;
		$scope.d_totalMoney = total_price-$scope.origin_price;
	}

	/* 상품 목록 */ 
	$scope.itemList = function()
	{
		location.href="#/list";
	}



	/* 장바구니 추가 */
	$scope.shoppingBasket =function(p_code,p_title, p_total_price, 
		                           p_buy_quantity, p_img, key)
	{
		if(key=='default')// 장바구니 -> 기본상품 담을때
		{
			$scope.pocketList = {
									'idx':$scope.idx+detailService.getCount(),
									'code':p_code,
								    'title':p_title,
									'origin_price':$scope.origin_price,
									'total_price':p_total_price,
									'total_quantity':p_buy_quantity,
									'img':p_img,
									'option':'',
									'option_price':0,
									'totalQuantity':$scope.totalQuantity
								   }
				detailService.addItem($scope.pocketList);
				location.href="#/cart";
		}

		else if(key=='option') //장바구니 -> 옵션상품 담을때 
		{
			if($scope.user.length==0)
			{
				alert("옵션을 추가해주세요.");
				return false;
			}
			else
			{
				var p_option = '';
				angular.forEach($scope.user, function(value)
				{	
					if(p_option =='')
					{
						p_option = p_option + value.optionSelected;
					}
					else
					{
						p_option = p_option + ', ' + value.optionSelected;
					}
					
				})
				if(p_option!='')
				p_option= '[옵션: '+p_option+"]";
				/* 장바구니 담을 object */
				$scope.pocketList = {
									'idx':$scope.idx+detailService.getCount(),
									'code':p_code,
								    'title':p_title,
									'origin_price':$scope.origin_price,
									'total_price':p_total_price,
									'total_quantity':p_buy_quantity,
									'img':p_img,
									'option':p_option,
									'option_price':$scope.option_price,
									'totalQuantity':$scope.totalQuantity
								   }
				detailService.addItem($scope.pocketList);
				location.href="#/cart";
			}
		}
		
	}

	/* 지금 구매하기 */
	$scope.nowBuy = function()
	{

	}

	/* 옵션 및 수량 보여주기 */
	$scope.showQuantity = function(value)
	{
		$scope.o_totalMoney = $scope.o_price;
		$scope.d_totalMoney = $scope.d_price;
		$(".quantity_txt").html(value);
		$(".content-o-quantity").show();

	}
})	






/************************************ 장바구니 ************************************************/
mall.controller("ItemShoppingbackController", function($scope, $routeParams, detailService)
{
/* 상품코드, 상품 총 가격, 총개수, 선택된 이미지, 선택 옵션*/

	$scope.pocketList = detailService.getItems(); //저장된 상품 가져오기
	$scope.number = 0; //초기값
	$scope.price =0;
	if($scope.pocketList.length!=0)
	{
		$scope.idx = $scope.pocketList[$scope.pocketList.length-1].idx;
		$scope.code = $scope.pocketList[$scope.pocketList.length-1].code;
		$scope.totalQuantity = $scope.pocketList[$scope.pocketList.length-1].totalQuantity;
		$scope.option_price = $scope.pocketList[$scope.pocketList.length-1].option_price;
		totalItems();
		totalCal();
	}

	/* 상품 목록 */
	$scope.itemList = function()
	{
		angular.forEach($scope.pocketList, function(item)
		{
			item.selected = false;
		});
		location.href="#/list";
	}

	/* 모든 상품 선택 */
	$scope.allCheck = function() 
	{
		if($scope.selectedAll) //모두 선택
		{
			$scope.selectedAll = true;
		}
		else //모두 해제
		{
			$scope.selectedAll = false;	
		}

		angular.forEach($scope.pocketList, function(item)
		{
			item.selected = $scope.selectedAll;
		});
	}

	/*장바구니 수량 증가버튼 */
	$scope.quantityUp = function(item)
	{
		if(item.total_quantity >=$scope.totalQuantity)
		{
			alert("최대 "+$scope.totalQuantity+"개 입니다.");
			item.total_quantity = $scope.totalQuantity;
			return false;
		}
		item.total_quantity +=1;
		item.total_price = item.total_price+item.origin_price + $scope.option_price;//(총가격=총가격+단가)
		totalCal();
	} 
	/* 장바구니 수량 감소버튼 */ 
	$scope.quantityDown = function(item)
	{
		if(item.total_quantity <=1)
		{
			alert("최소 1개이상입니다.");
			return false;
		}
		item.total_quantity -=1;
		item.total_price = item.total_price-item.origin_price - $scope.option_price; //(총가격= 총가격-단가)
		totalCal();	
	}

	/* 선택 상품 삭제 */
	$scope.selectedDelete = function(item)
	{
		$scope.pocketList = angular.forEach($scope.pocketList, function(value,index){
			if(value.idx==item.idx)
			{
				$scope.pocketList.splice(index,1);	
			}
		});
		totalItems();
		totalCal();
	}

	/* 선택한 상품 자세히 보기 */
	$scope.selectedDetail = function(){
		location.href="#/detail/"+$scope.code;
	}

	/* 장바구니 비우기  */
	$scope.allDelete = function()
	{
		if($scope.pocketList!=null)
		{
			$scope.pocketList = detailService.clear(); //저장된 상품 배열 초기화
			totalItems(); //상품 수량
			totalCal(); //상품 계산
		}
		else
		{
			alert("상품이 존재하지 않습니다.");
		}
	}

	/* 총 구매 금액 계산 */
	function totalCal()
	{
		$scope.price = 0; //금액 초기화
		angular.forEach($scope.pocketList, function(item){
			$scope.price+=item.total_price;
		});
	}

	/* 아이템 총 개수 */
	function totalItems() 
	{
		if($scope.pocketList!=null)
		{
			$scope.number = $scope.pocketList.length;
		}
		else
		{
			$scope.number = 0;
		}
	}

})



/******************************************* 상품 등록 ****************************************/
mall.directive('itemInsert', function(configService, $document, mallfactory, optionfactory, categoryfactory){
	return {
		restrict: 'E',
		templateUrl: configService.shopPublicUrl+'template/admin/item/iteminsert.html',
		link: function($scope, element, attr){	
			var mallLength;
			$scope.leftCategory="null";
			$scope.centerCategory="null";
			$scope.rightCategory="null";


			$scope.left_categoryInput ={
				c_name:"",
				c_depth:0,
				c_parent:0,
				c_group:""
			}

			$scope.center_categoryInput = {
				c_name:"",
				c_depth:1,
				c_group:""
			}

			$scope.right_categoryInput = {
				c_name:"",
				c_depth:2,
				c_group:""
			}

			left_getCategorys(0);



			//대분류 데이터 가져오기
			function left_getCategorys(n)
			{
				$scope.left_categoryList = categoryfactory.get({id:n});
			}
			//중분류 데이터 가져오기
			function center_getCategorys(n)
			{
				$scope.center_categoryList = categoryfactory.get({id:n});
			}
			//소분류 데이터 가져오기
			function right_getCategorys(n)
			{
				$scope.right_categoryList = categoryfactory.get({id:n});
			}


			$scope.leftChange = function()
			{
				$scope.leftPath = $scope.leftCategory.c_name;
				$scope.totalPosition = $scope.leftPath;

				$scope.center_categoryInput.c_parent = $scope.leftCategory.c_idx;
				$scope.center_categoryInput.c_group = $scope.leftCategory.c_group;
				$scope.center_categoryList = categoryfactory.get({id:$scope.center_categoryInput.c_parent}); /* 중분류 데이터 가져오기 */
				
				$scope.right_categoryList = null; //소분류 리스트 초기화
				$scope.right_categoryInput.c_parent = null; //소분류 부모 초기화
			}

			$scope.centerChange = function()
			{
				$scope.centerPath = $scope.leftCategory.c_name+"/"+$scope.centerCategory.c_name;
				$scope.totalPosition = $scope.centerPath;
				$scope.right_categoryInput.c_parent = $scope.centerCategory.c_idx;
				$scope.right_categoryInput.c_group = $scope.centerCategory.c_group;
				$scope.right_categoryList = categoryfactory.get({id:$scope.right_categoryInput.c_parent});
			}

			$scope.rightChange = function()
			{
				$scope.totalPosition = $scope.centerPath+"/"+$scope.rightCategory.c_name;
			}



			$scope.DefalutImage = '../public/image/noImage.png';
			mallfactory.query().$promise.then(function(result)
			{
				mallLength = result.length;
				if(mallLength!=0)
				mallLength = result[mallLength-1].p_order;
			}) 
			
		 	
			$scope.ck = CKEDITOR.replace("contents",
			{
				height:400
			});
			$scope.p_status = 'y'; //상품 상태 초기화
			
			function init()
			{	
				location.reload();
			}

			var files =''; //이미지 업로드 파일변수

			$scope.itemInsert = function() //(기본 상품 정보) + (기본 옵션 정보) 추가
			{	

			    $scope.fileList.forEach(function(obj)
				{
				     if(files == '')
				     {
				        files = files + obj;
				     }
				     else
				     {
				        files = files + ',' + obj; //(img1, img2, img3.... )담는다.
				     }
			    });


				$scope.item.p_code = 'A'+Math.floor((Math.random() * 10000000) + 1);
			    $scope.item.p_contents = $scope.ck.getData(); //설명 
				$scope.item.p_big_img = $scope.itemList.p_big_img; //큰 이미지 
				
				$scope.item.p_small_img = files;

				$scope.item.p_status = $scope.p_status;//이미지 표시
				$scope.item.p_order = mallLength+1; //상품 개수
				$scope.item.p_position = $scope.totalPosition;
				mallfactory.save({item:$scope.item});


				$scope.option = [
				{
					'o_code':$scope.item.p_code,
					'o_field_name_txt':'상품명',
					'o_value':$scope.item.p_title,
					'o_all_status':$scope.item.p_status,
					'o_type':'default',
					'o_order':1
				},
				{
					'o_code':$scope.item.p_code,
					'o_field_name_txt':'가격',
					'o_value':$scope.item.p_price,
					'o_all_status':$scope.item.p_status,
					'o_type':'default',
					'o_order':2	
				},
				{
					'o_code':$scope.item.p_code,
					'o_field_name_txt':'수량',
					'o_value':$scope.item.p_quantity,
					'o_all_status':$scope.item.p_status,
					'o_type':'default',
					'o_order':3

				}
				];
				optionfactory.save({option:$scope.option, type:'default'});
				alert("등록 되었습니다");
			}

		}
	}
})


/******************************************* 상품 관리 ****************************************/
mall.directive('itemManage', function(mallfactory, optionfactory, $timeout, $mdDialog, configService){
	return {
		restrict: 'E',
		templateUrl: configService.shopPublicUrl+'template/admin/right_manage.html',
		link: function(scope, element, attr){





			var originatorEv;     
			/* 상품 관리 영역 */
			scope.ItemNumber = null;
			scope.ItemNumbers = [1,2,3,4,5,6,7,8,9,10];
			scope.totalItemNumber = 0; //상품 총개수 초기화
		    scope.itemperpage = 6; //페이지당 상품 표시 개수
		    scope.currentPage = 1; //현재 페이지 표시
		    scope.itemList = [];
		    scope.item = {
		    	selected: false
		    }
		    scope.orderProperty = 'p_order';

		    getItems();
			/* 상품 관리 리스트 불러오기*/ 

			function getItems()
			{	
				scope.currentPage = 1; //현재 페이지 표시
				mallfactory.query().$promise.then(function(result) 
				{
					scope.itemList = result;		
					scope.totalItemNumber = result.length; //아이탬 총 개수
				    scope.startItem = (scope.currentPage -1) * scope.itemperpage;
				    scope.endItem = scope.startItem + scope.itemperpage;
				    scope.totalItems = scope.itemList.slice(scope.startItem, scope.endItem);   
				}) 
			}

			/* 페이지 이동 */
		    scope.pageChanged = function() 
			{   
			        scope.startItem = (scope.currentPage -1) * scope.itemperpage;  
			        scope.endItem = scope.startItem + scope.itemperpage; 
			        scope.totalItems = scope.itemList.slice(scope.startItem, scope.endItem)
			}

			/* 모든 상품 선택 */
			scope.allCheck = function() 
			{
				if(scope.selectedAll) //모두 선택
				{
					scope.selectedAll = true;
				}
				else //모두 해제
				{
					scope.selectedAll = false;	
				}

				angular.forEach(scope.itemList, function(item)
				{
					item.selected = scope.selectedAll;
				});
			}

			/* 선택된 상품 삭제 */
			scope.seletedDelete = function()
			{
				$('.md-checked').each(function()
				{
					var code = $(this)[0].id //checkbox_id get Value 
					if(code != '')
					{
						mallfactory.delete({id:code});
						optionfactory.delete({id:code, type:2});
					}
				})
				scope.selectedAll = false;
				getItems();	
			}

			/* 체크 박스 */
			scope.checkModule = function(item)
			{
				
				if(item.selected == true)
				{	
					item.delete = false;
				}
				else
				{
					item.delete = true;
				}
			}

			/* 옵션 수정 */
			scope.optionModify = function(ev,item)
			{
				scope.$parent.normal = 'optionedit';
				scope.$parent.optionEditList = item;
			}

			/* 옵션 추가 */
			scope.optionInsert = function(ev,item)
			{
				scope.$parent.normal = 'optioninsert';
				scope.$parent.optionInsertList = item;

			}

			/* 옵션 드롭 */
			scope.optionDrop = function(ev,item)
			{
				$mdDialog.drop = item;
				$mdDialog.show({
					controller:"OptionDropController",
					templateUrl:configService.shopPublicUrl+'template/admin/option/optiondrop.html',
					parent:angular.element(document.body),
					targetEvent:ev,
					clickOutsideToclose:true
				});
			}

			scope.optionDropEdit = function(ev, item)
			{
				$mdDialog.dropEdit = item;
				$mdDialog.show({
					controller:"OptionDropEditController",
					templateUrl:configService.shopPublicUrl+'template/admin/option/optiondropEdit.html',
					parent:angular.element(document.body),
					targetEvent:ev,
					clickOutsideToclose:true
				});
			}

			/* 상품 편집 */
			scope.itemEdit = function(item)
			{
				scope.$parent.normal = 'edit';
				scope.$parent.itemEditList = item;
			}

			/* 오픈 메뉴 */
			scope.openMenu = function($mdOpenMenu, ev)
			{
		      originatorEv = ev;
		      $mdOpenMenu(ev);
			}

			/* 페이지당 아이템 개수 표시 */
			scope.loadItems = function()
			{ 

				if(scope.ItemNumber!=null)
				{
					scope.itemperpage = Number(scope.ItemNumber);
					getItems();	
				}
				else
				{
					return false;
				}
			}
			/* 리스트 이동*/
			scope.list = function()
			{
				location.href ="#/list";
			}

			scope.random = function()
			{
				return new Date().toString();
			}

			/* 순서 바꾸기 */
			scope.orderChange = function(order,type, event)
		    {
				if(type=="up")
		    	{
		    		if(order==0)
		    		{
		    			return false;
		    		}
		    		else
		    		{
		    			var temp = null; //임시저장 공간
			    		temp = scope.totalItems[order].p_order;
			    		scope.totalItems[order].p_order = scope.totalItems[order-1].p_order;
			    		scope.totalItems[order-1].p_order = temp;
			    		changeposition(order);
		    		}
		    	}
		    	else if(type=="down")
		    	{
		    		
		    		if($(event)[0].currentTarget.className=='last')
		    		{
		    			return false;
			    	}
			    	else
			    	{
			    		var temp = null;
			    		temp = scope.totalItems[order].p_order;
			    		scope.totalItems[order].p_order = scope.totalItems[order+1].p_order;
			    		scope.totalItems[order+1].p_order = temp;
			    		changeposition(order+1);
			    	}
		    	}
		    }

		    scope.save = function()
		    {
		    	mallfactory.update({
		    		id:scope.totalItems, type:'multiple'
		    	}).$promise.then(function(){
		    		alert("변경 되었습니다.");
		    	});
		    }

		    function changeposition(val){ 
		       var temp;   
		       temp = scope.totalItems[val];
		       scope.totalItems[val] = scope.totalItems[val-1];
		       scope.totalItems[val-1] = temp;   
		    }
		}
	}
})


/******************************************* 상품 수정 ****************************************/
mall.directive('itemEdit', function(mallfactory, $timeout, configService, $compile ,uploadfactory){
	return {
		restrict: 'E',
		templateUrl: configService.shopPublicUrl+'template/admin/item/itemedit.html',
		controllerAS:"AdminCtrl",
		link: function($scope, element, attr){

			var img = $("<make-file-div>");
			$scope.info = [];
			$scope.itemList= $scope.itemEditList;
			$scope.DefalutImage = $scope.itemList.p_big_img;
			$scope.imgList = [];
			$scope.fileList = [];
			$scope.ck = CKEDITOR.replace("contents",
			{
				height:500
			});

			$scope.ck.setData($scope.itemList.p_contents);
			 
			file_ck_title = $scope.itemList.p_big_img;
			
		    uploadfactory.get({id:$scope.itemList.p_small_img}).$promise.then(function(result){
	            result.forEach(function(result){
	               file_ck_append = $(result.file_origin_name.split('.')).last()[0];
	               file_ck_name = result.file_name;
	               file_ck_path = result.file_path + '/' + result.file_name;
	               file_ck_idx = result.file_idx;
	               file_ck_origin_name = result.file_origin_name;
	               make_file_div(file_ck_append,file_ck_path,file_ck_idx,file_ck_origin_name,file_ck_title);            
	            })
	         })

		    function make_file_div(file_ck_append,file_ck_path,file_ck_idx,file_ck_origin_name,file_ck_title)
		    {
		        if(file_ck_append=='jpg' || file_ck_append=='JPG' || file_ck_append=='gif' || 
		           file_ck_append=='GIF' || file_ck_append=='png' || file_ck_append=='PNG' || 
		           file_ck_append=='jpeg' || file_ck_append=='JPEG')
		        {
		            $scope.info.push({
		                'basesrc':"../"+file_ck_path,
		                'idx':file_ck_idx,
		                'title':file_ck_origin_name,
		                'main':file_ck_title,
		                'btn': 'yes'
		            });
		        }
		        else{
		            $scope.info.push({
		                'basesrc':'image/ic_insert_drive_file_black_48dp_2x.png',
		                'idx':file_ck_idx,
		                'title':file_ck_origin_name,
		                'main':file_ck_title,
		                'btn': 'no'
		            });
		        }
		        $scope.fileList.push(file_ck_idx);

		    }

		    $scope.sel_title = function(e, val){
		      $('.md-warn').removeClass('md-warn');
		      $(e.currentTarget).addClass('md-warn');
		        $scope.itemList.p_big_img = val;
		        $scope.DefalutImage = val;
		    }

		    $scope.sel_insert = function(e){
		      var src = $(e.currentTarget)[0].parentElement.children[1].src;
		      $scope.ck.insertHtml("<img src='" +src+ "'>");
		    }

		    $scope.sel_delete = function(e)
        	{
		        var check = $(e.currentTarget)[0].parentElement.children[3].classList;
		        var reitem = true;
		        angular.forEach(check, function(value, key)
		        {
		           if(value == 'md-warn')
		           {
		              alert("타이틀 지정 이미지는 삭제가 불가능합니다.");
		              reitem = false;
		              return;
		           }
		        });

		        if(reitem)
		        {
		           var idx = $(e.currentTarget)[0].parentElement.parentElement.classList[1];
		           if(idx == 'layout-wrap')
		           {
		              idx = $(e.currentTarget)[0].parentElement.classList[1];
		           }
		           setTimeout(function(){
		              $scope.delete(idx);
		               $('.'+idx).remove();
		               $('md-tooltip').remove();   
		           },200)

	               $scope.fileList = jQuery.grep($scope.fileList, function(value) 
	               {
	               	return value != idx;
		           });   
		        }
         	}	

		   
		   
	        function getExtensionOfFilename(filename) 
	        {
				var _fileLen = filename.length; //파일 길이
				var _lastDot = filename.lastIndexOf('.'); //마지막 점
				// 확장자 명만 추출한 후 소문자로 변경
				var _fileExt = filename.substring(_lastDot+1, _fileLen).toLowerCase();
				return _fileExt;
			}   


		    $scope.itemUpdate = function()
		    {
		    	$scope.itemList.p_contents = $scope.ck.getData();
		    	 var idxs ='';
		    	 var files='';
		    	$scope.fileList.forEach(function(obj)
				{
				     if(files == '')
				     {
				        files = files + obj;
				     }
				     else
				     {
				        files = files + ',' + obj;
				     }
			    });

		    	$scope.itemList.p_small_img = files;
		    	mallfactory.update({
		    		id:$scope.itemList, type:'only'
		    	}).$promise.then(function(){
		    		alert("변경 되었습니다.");
		    	});
		    }
		}
	}	
})


/******************************************* 타이틀 수정 ****************************************/

mall.directive('optionEdit', function(configService, optionfactory, mallfactory){
	return {
		restrict: 'E',
		templateUrl: configService.shopPublicUrl+'template/admin/option/optionedit.html',
		controllerAS:"AdminCtrl",
		link: function($scope, element, attr){

			setTimeout(function(){
		    	$('.field_colorpicker').colorpicker().on('hidePicker', function(event)
			    {               
			        	var index = $(this).attr('id');
			        	$scope.optionList[index].o_field_name_color = event.color.toHex();

			    });	
		    },500)

		    setTimeout(function(){
		    	$('.val_colorpicker').colorpicker().on('hidePicker', function(event)
			    {               
			        	var index = $(this).attr('id');
			        	$scope.optionList[index].o_value_color = event.color.toHex();
			    });	
		    },500)	
		    
		    
			var str = null;
			$scope.option ={
				o_field_name_fontsize:'10pt',
				o_field_name_fontfamily:'나눔고딕',
				o_value_fontsize:'10pt',
				o_value_fontfamily:'나눔고딕'
			};

			$scope.orderProperty = 'o_order';
			$scope.item = {};
			getItems();

			
			function getItems() //옵션 수정 데이터 불러오기
			{
				
				optionfactory.query({id:$scope.optionEditList.p_code}).$promise.then(function(result,$index)
				{	

					$scope.optionList = $.grep(result, function(value, index){
						if(value.o_type=="multiple")
						{
							value.o_value = Number(result[index].o_value);
							str = result[index].o_select_box;
							if(str!=null)
							value.o_select_box = str.split(',');
						}
						else
						{	
							return true;
						}
					})
				});
			}



			$scope.cancel = function() 
			{
		    	$scope.$parent.normal = 'manage';
		    }

		    $scope.update = function()
		    {	
		    	/*option에 기본값 변동 + product 기본값 변동 (동시) */
				angular.forEach($scope.optionList, function(option)
				{
					$scope.item.p_code = option.o_code;
					if(option.o_field_name_txt=='상품명')	
					$scope.item.p_title = option.o_value; 
					else if(option.o_field_name_txt=='가격')
					$scope.item.p_price = option.o_value;
					else if(option.o_field_name_txt=='수량')
					$scope.item.p_quantity = option.o_value;
				}); 

		    	if($scope.item.p_title!=null || $scope.item.p_price!=null || $scope.item.p_quantity)
		    	{
		    		mallfactory.update({
				    		id:$scope.item, type:'default'
				    });
		    	}//end 

		    	optionfactory.update({
		    		id:$scope.optionList
		    	}).$promise.then(function(){
		            alert("변경 되었습니다");
		    		
		        });

		    }

		    /* 체크 박스 */
			$scope.checkModule = function(option)
			{
				
				if(option.selected == true)
				{	
					option.delete = true;
				}
				else
				{
					option.delete = true;
				}
			}

			/*선택된 옵션 삭제 */
		    $scope.selectedDelete = function()
		    {
		    	angular.forEach($scope.optionList, function(option)
		    	{
		    		if(option.delete==true)
					{	
						optionfactory.delete({id:option.o_idx, type:1});
					}
					else
					{
						return true;
					}
		    	});
		    	getItems();
		    }

		    $scope.orderChange = function(order,type, event)
		    {
				if(type=="up")
		    	{
		    		if(order==0)
		    		{
		    			return false;
		    		}
		    		else
		    		{
		    			var temp = null; //임시저장 공간
			    		temp = $scope.optionList[order].o_order;
			    		$scope.optionList[order].o_order = $scope.optionList[order-1].o_order;
			    		$scope.optionList[order-1].o_order = temp;
			    		changeposition(order);
		    		}
		    	}
		    	else if(type=="down")
		    	{
		    		
		    		if($(event)[0].currentTarget.className=='last')
		    		{
		    			return false;
			    	}
			    	else
			    	{
			    		var temp = null;
			    		temp = $scope.optionList[order].o_order;
			    		$scope.optionList[order].o_order = $scope.optionList[order+1].o_order;
			    		$scope.optionList[order+1].o_order = temp;
			    		changeposition(order+1);
			    	}
		    	}
		    	
		    }

		     function changeposition(val){ 
		       var temp;   
		       temp = $scope.optionList[val];
		       $scope.optionList[val] = $scope.optionList[val-1];
		       $scope.optionList[val-1] = temp;   
		    }
		}
	}
})



/******************************************* 옵션 등록 ****************************************/

mall.directive('optionInsert', function(configService, optionfactory, mallfactory, $compile){
	return {
		restrict: 'E',
		templateUrl: configService.shopPublicUrl+'template/admin/option/optioninsert.html',
		controllerAS:"AdminCtrl",
		link: function($scope, element, attr)
		{
			$scope.optionDropSelect =[];
			$scope.optionUse = 'n';
			$scope.option = {
				o_code:$scope.optionInsertList.p_code,
				o_all_status:"y",
				o_type:"only",
				o_field_name_color:"#000",
				o_field_name_fontsize:"10pt",
				o_field_name_fontfamily:"나눔고딕",
				o_value_color:"#000",
				o_value_fontsize:"10pt",
				o_value_fontfamily:"나눔고딕",
			}

			$scope.optionDrop = {
				o_code:$scope.optionInsertList.p_code,
				o_field_name:"옵션",
				o_all_status: 'n',
				o_type:"multiple",
				o_select_box:null,
				o_value:null,
				o_order:0, 
			};

			$scope.DropSelect = null;
			

			$scope.optionDropAdd = function()
			{
				$scope.optionDropSelect.push($scope.optionDrop.o_select_box); 
				alert("추가 되었습니다");
			}

			$scope.add = function()
			{	
				
				/*옵션 드롭 가져오기*/
				var optiondrop_select_values = '';

		    	angular.forEach($scope.optionDropSelect, function(value)
		    	{
		    		 if(optiondrop_select_values == '')
				     {
				        optiondrop_select_values = optiondrop_select_values + value;
				     }
				     else
				     {
				        optiondrop_select_values = optiondrop_select_values + ',' + value;
				     }
		    	});
		    	
		    	//옵션드롭 추가 
		    	if($scope.optionUse=='y' && $scope.optionDrop.o_field_name_txt!=null && $scope.optionDrop.o_value!=null) 
				{
					$scope.optionDrop.o_select_box = optiondrop_select_values;
					optionfactory.save({option:$scope.optionDrop, type:'drop'});
				}

				//옵션 기본추가
				if($scope.option.o_field_name_txt!=null && $scope.option.o_value!=null) //제목과 값이 모두 적혀있을경우
				{
					
					optionfactory.save({option:$scope.option, type:'insert'});	
				}
				alert("등록 되었습니다");
				
			}

		    $scope.optionState = function() //옵션 사용여부
		    {
		    	if($scope.optionUse=='y')
		    	{
		    		optionDropNumber($scope.optionInsertList.p_code); //옵션드롭넘버
		    		$("#optionDrop").css("display","");

		    	}
		    	else
		    	{
		    		$("#optionDrop").css("display","none");
		    	}
		    }

		    

			function optionDropNumber(p_code) //현재 옵션 개수 가져오기
			{
				optionfactory.query({id:p_code}).$promise.then(function(result)
				{
					result = $.grep(result, function(val)
					{
						if(val.o_type=='multiple')
						{
							return true;
						}
					})
					$scope.optionDrop.o_order = result.length+1;
				})
			}
		}
	}
});


//옵션 드롭 수정
mall.controller("OptionDropEditController", function($scope, $mdDialog, optionfactory, $compile)
{
	var str = null;
	$scope.orderProperty = 'o_order';
	getItems();
	function getItems() //옵션 수정 데이터 불러오기
	{
		optionfactory.query({id:$mdDialog.dropEdit.p_code}).$promise.then(function(result,$index)
		{
			$scope.optionList = $.grep(result, function(value, index){
				if(value.o_type=="multiple")
				{
					value.o_value = Number(result[index].o_value);
					str = result[index].o_select_box;
					if(str!=null)
					value.o_select_box = str.split(',');
					return true;
				}
			})
			
		});
	}	

	$scope.update = function()
    {
    	var checkCount = 0;
    	if($scope.optionList.length==0)
    	{
    		$mdDialog.hide();
    		return false;

    	}
    	angular.forEach($scope.optionList, function(value)
    	{
    		var option_select_values = '';	
    		if(value.o_all_status=='y') //옵션 1개만 쓸수 있도록 설정.
			{
				checkCount++;
			}
    		if(value.o_select_box!=null)
    		{
    			angular.forEach(value.o_select_box, function(result)
    			{
    				if(option_select_values == '')
				    {
				        option_select_values = option_select_values + result;
				    }
				    else
				    {
				       option_select_values = option_select_values + ',' + result;
				    }
				    value.o_select_box = option_select_values;	
    			});

    		}
    	});

    	if(checkCount<2)
    	{

	    	optionfactory.update({
	    		id:$scope.optionList
	    	}).$promise.then(function(){
	            alert("변경 되었습니다");
	    		$mdDialog.hide();
	        });
        }
        else
        {
        	alert("옵션 표시상태 ->Y 변경(1개 가능)");
        	return false;
        }
    }

    /* 체크 박스 */
	$scope.checkModule = function(option)
	{
		
		if(option.selected == true)
		{	
			option.delete = true;
		}
		else
		{
			option.delete = true;
		}
	}

	/*선택된 옵션 삭제 */
    $scope.selectedDelete = function()
    {
    	angular.forEach($scope.optionList, function(option)
    	{
    		if(option.delete==true)
			{	
				optionfactory.delete({id:option.o_idx, type:1});
			}
			else
			{
				return true;
			}
			getItems();	
    	});
    }

    $scope.orderChange = function(order,type, event)
    {
		if(type=="up")
    	{
    		if(order==0)
    		{
    			return false;
    		}
    		else
    		{
    			var temp = null;
    			temp = $scope.optionList[order].o_order;
	    		$scope.optionList[order].o_order = $scope.optionList[order-1].o_order;
	    		$scope.optionList[order-1].o_order = temp;
	    		changeposition(order);
    		}
    	}
    	else if(type=="down")
    	{
    		
    		if($(event)[0].currentTarget.className=='last')
    		{
    			return false;
	    	}
	    	else
	    	{
	    		var temp = null;
	    		temp = $scope.optionList[order].o_order;
	    		$scope.optionList[order].o_order = $scope.optionList[order+1].o_order;
	    		$scope.optionList[order+1].o_order = temp;
	    		changeposition(order+1);
	    	}
    	}
    	
    }

	$scope.cancel = function() 
	{
    	$mdDialog.cancel();
    }

    function changeposition(val){ 
       var temp;   
       temp = $scope.optionList[val];
       $scope.optionList[val] = $scope.optionList[val-1];
       $scope.optionList[val-1] = temp;   
    }


})
/* 상품 목록 View */
mall.directive('itemView', function(configService, $document, mallfactory, optionfactory){
	return {
		restrict: 'E',
		templateUrl: configService.shopPublicUrl+'template/view.html',
		link: function(scope, element, attr){	

			scope.totalItemNumber = 0; //상품 총개수 초기화
    		scope.itemperpage = 3; //페이지당 상품 표시 개수
    		scope.currentPage = 1; //현재 페이지 표시
    		getItems(); //상품 가져오기 
    		scope.items =[]; //상품을 담는 공간

    		/* 상품 가져오기 Pagination */
    		function getItems()
		    {   
		    	/* 상품 가져오는 쿼리문 */ 
		        mallfactory.query().$promise.then(function(result)
		        { 
			        scope.totalItemNumber = result.length; //아이탬 총 개수
			        scope.items = result; 
			        scope.startItem = (scope.currentPage -1) * scope.itemperpage;
			        scope.endItem = scope.startItem + scope.itemperpage;
			        scope.totalItems = scope.items.slice(scope.startItem, scope.endItem);   
		        })
		    }
		}
	}
})

mall.directive('itemSetting', function(configService, mallfactory){
	return {
		restrict: 'E',
		templateUrl: configService.shopPublicUrl+'template/admin/item/itemsetting.html',
		link: function(scope, element, attr){	
			scope.totalItemNumber = 0; //상품 총개수 초기화
    		scope.itemperpage = 9; //페이지당 상품 표시 개수
    		scope.currentPage = 1; //현재 페이지 표시

    		scope.user ={
    			selectedOption:'옵션을 설정하세요'
    		};


			getItems(); //상품 가져오기 
			function getItems()
		    {   
		    	/* 상품 가져오는 쿼리문 */ 
		        mallfactory.query().$promise.then(function(result)
		        { 
			        scope.totalItemNumber = result.length; //아이탬 총 개수
			        scope.items = result; 
			        scope.startItem = (scope.currentPage -1) * scope.itemperpage;
			        scope.endItem = scope.startItem + scope.itemperpage;
			        scope.totalItems = scope.items.slice(scope.startItem, scope.endItem);   
		        })
		    }

		    scope.changeImgNumber = function(number)
		    {
		    	scope.itemperpage = number;
		    	getItems();
		    }

		}
	}
})

mall.directive('pageCategory', function(configService, categoryfactory){
	return {
		restrict: 'E',
		templateUrl: configService.shopPublicUrl+'template/admin/category/pagecategory.html',
		link: function(scope, element, attr){	
			
			scope.position={
				left_category:"",
				center_category:"",
				right_category:""
			};
			scope.bottomCategory ={
				c_idx:"",
				c_name:"",
				c_url:"",
				c_description:"",
				c_category:"",
				c_status:"y"
			}

			scope.left_categoryInput ={
				c_name:"",
				c_depth:0,
				c_parent:0,
				c_group:""
			}

			scope.center_categoryInput = {
				c_name:"",
				c_depth:1,
				c_group:""
			}

			scope.right_categoryInput = {
				c_name:"",
				c_depth:2,
				c_group:""
			}

			left_getCategorys(0);
			
			//상세정보 초기화
			function bottomCategoryInit() 
			{
				scope.bottomCategory.c_idx="";
				scope.bottomCategory.c_name="";
				scope.bottomCategory.c_url="";
				scope.bottomCategory.c_description="";
				scope.bottomCategory.c_position="";
				scope.bottomCategory.c_status="y";
			}

			//대분류 데이터 가져오기
			function left_getCategorys(n)
			{
				scope.left_categoryList = categoryfactory.get({id:n});
			}
			//중분류 데이터 가져오기
			function center_getCategorys(n)
			{
				scope.center_categoryList = categoryfactory.get({id:n});
			}
			//소분류 데이터 가져오기
			function right_getCategorys(n)
			{
				scope.right_categoryList = categoryfactory.get({id:n});
			}

			/* 대 중 소 데이터 정의 */

			
			//대분류 클릭
			scope.leftClick = function(event, category_parent, category_name, category_group, category_url, category_description, category_status)
			{	
				scope.bottomCategory.c_idx = category_parent; //분류 고유번호	
				scope.position.left_category = category_name; //현재 분류
				scope.bottomCategory.c_name = category_name; //분류 명
				scope.bottomCategory.c_url = category_url; //분류url
				scope.bottomCategory.c_position = scope.position.left_category; //분류 카테고리
				scope.bottomCategory.c_description = category_description; //분류 설명
				scope.bottomCategory.c_status = category_status;
				
				
				$(".left_category").each(function()
				{
					$(".left_category").removeClass("category-click");
				})
				$(event.currentTarget).addClass("category-click");

				scope.center_categoryInput.c_parent = category_parent;
				scope.center_categoryInput.c_group = category_group;
				scope.center_categoryList = categoryfactory.get({id:category_parent}); /* 중분류 데이터 가져오기 */
				
				scope.right_categoryList = null; //소분류 리스트 초기화
				scope.right_categoryInput.c_parent = null; //소분류 부모 초기화
			}

			//중분류 클릭
			scope.centerClick = function(event, category_parent, category_name, category_group, category_url, category_description, category_status)
			{
				scope.bottomCategory.c_idx = category_parent; 
				scope.position.center_category = scope.position.left_category+"/"+category_name;
				scope.bottomCategory.c_name = category_name;
				scope.bottomCategory.c_url = category_url; 
				scope.bottomCategory.c_position = scope.position.center_category;
				scope.bottomCategory.c_description = category_description;
				scope.bottomCategory.c_status = category_status;
				

				$(".center_category").each(function(){
					$(".center_category").removeClass("category-click");
				})
				$(event.currentTarget).addClass("category-click");
				
				scope.right_categoryInput.c_parent = category_parent;
				scope.right_categoryInput.c_group = category_group;
				scope.right_categoryList = categoryfactory.get({id:category_parent});

			}
			//소분류 클릭
			scope.rightClick = function(event, category_parent, category_name, category_group, category_url, category_description, category_status)
			{
				scope.bottomCategory.c_idx = category_parent;
				scope.position.right_category = scope.position.center_category+"/"+category_name;
				scope.bottomCategory.c_name = category_name;
				scope.bottomCategory.c_url = configService.shopPublicUrl+category_parent;
				scope.bottomCategory.c_position = scope.position.right_category;
				scope.bottomCategory.c_description = category_description;
				scope.bottomCategory.c_status = category_status;
				

				$(".right_category").each(function()
				{
					$(".right_category").removeClass("category-click");
				})
				$(event.currentTarget).addClass("category-click");
			}



			//대분류 추가
			scope.left_categoryInsert = function()
			{
				scope.left_categoryInput.c_position = scope.left_categoryInput.c_name;//현재분류
				if(scope.left_categoryInput.c_name!="")
				{
					categoryfactory.save({category:scope.left_categoryInput, category_status:"left", category_url:configService.shopPublicUrl});
					setTimeout(function(){
						left_getCategorys(0);
						scope.center_categoryList = null; //초기화
						scope.right_categoryList = null; //초기화

						scope.center_categoryInput.c_parent = null; //중분류 부모 초기화
						scope.right_categoryInput.c_parent = null; //소분류 부모 초기화					
						scope.left_categoryInput.c_name ="";	
					},500)
				}
				else
				{
					alert("대분류를 입력하세요.");
				}	
				
			}

			//중분류 추가
			scope.center_categoryInsert = function()
			{
				scope.center_categoryInput.c_position = scope.position.left_category+"/"+scope.center_categoryInput.c_name; //현재분류
				
				if(scope.center_categoryInput.c_parent!=null)
				{
					if(scope.center_categoryInput.c_name!="")
					{
						categoryfactory.save({category:scope.center_categoryInput, category_status:"center", category_url:configService.shopPublicUrl});
						setTimeout(function(){
							center_getCategorys(scope.center_categoryInput.c_parent);
							scope.right_categoryList = null; //초기화	
							scope.center_categoryInput.c_name ="";	
						},500)
					}
					else
					{
						alert("중분류 입력하세요.");
					}
				}
				else
				{
					alert("대분류 클릭하세요.");
				}
			}

			//소분류 추가
			scope.right_categoryInsert = function() 
			{
				scope.right_categoryInput.c_position = scope.position.center_category+"/"+scope.right_categoryInput.c_name;
				if(scope.right_categoryInput.c_parent!=null)
				{	
					if(scope.right_categoryInput.c_name!="") //이름을 입력했을때
					{
						categoryfactory.save({category:scope.right_categoryInput, category_status:"right", category_url:configService.shopPublicUrl});
						setTimeout(function(){
							right_getCategorys(scope.right_categoryInput.c_parent);	
							scope.right_categoryInput.c_name ="";
						},500)
					}

					else
					{
						alert("소분류 입력하세요.");
					}
					
				}
				else
				{
					alert("중분류 클릭하세요.");
				}
			}

			//카테고리 삭제
			scope.categoryDelete = function(category,type)
			{
				if(type=="left") //대분류 삭제
				{
					categoryfactory.delete({id:category.c_idx, type:type});
					setTimeout(function(){
						left_getCategorys(0);
						scope.center_categoryList = null;
						scope.right_categoryList = null;
					},500);
				}

				else if(type=="center") //중분류 삭제
				{
					categoryfactory.delete({id:category.c_idx, type:type});
					setTimeout(function(){
						center_getCategorys(scope.center_categoryInput.c_parent);
						scope.right_categoryList = null;
					},500);	
				}
				
				else if(type=="right") //소분류 삭제
				{
					categoryfactory.delete({id:category.c_idx, type:type});
					setTimeout(function(){
						right_getCategorys(scope.right_categoryInput.c_parent);
					},500);	
				}				
				bottomCategoryInit();
			}

			//카테고리 설정
			scope.bottomCategorySetting = function() 
			{	
				if(scope.bottomCategory.c_idx=="")
				{
					alert("분류를 클릭하세요.");
					return false;
				}
				categoryfactory.update({
		    		id:scope.bottomCategory
		    	}).$promise.then(function(){
		    		alert("변경 되었습니다.");
		    		left_getCategorys(0);
		    		scope.center_categoryList = null;
					scope.right_categoryList = null;
		    		bottomCategoryInit();
		    	});
			}
		}
	}
})


/******************************************* 파일 업로드 ****************************************/
mall.directive('fileupload', function($compile,$timeout,Upload, configService, uploadfactory, $document){
    return{
        restrict: 'E',
        transclude: true,
        templateUrl: configService.shopPublicUrl+'template/admin/upload/fileupload.html',
        link: function($scope, element, attr){  //공유 불가능
           var imgvalidate = /^(?:image\/bmp|image\/gif|image\/jpeg|image\/png|image\/x\-xwindowdump|image\/x\-portable\-bitmap)$/i;
            $scope.filesavePath = attr.src;
            $scope.fileList = [];
            $scope.imgList= []; //이미지리스트
            $scope.itemList ={};    
            var parent_div = $(" <make-file-div>"); 
            var ck = true; 
            $scope.cnt = 0; 
            
            $scope.fileselect = function(file){
            	
               if(file && !file.$error){	
               	  if($scope.cnt==5)
               	  {
               	  	alert("최대 5개 입니다.");
               	  	return false;
               	  }
               	  if(file=='')
               	  {
               	  	return ;
               	  }
                  parent_div = $("<make-file-div>");
                  $('.imglist').append(parent_div);
                  $compile(parent_div)($scope);
                  $scope.spanfilename = file[0].name;
                   ck = true;

                  $('.img_list span').each(function(index,result)
                  {
	                  if(result.innerHTML == file[0].name)
	                  {
	                     alert('같은 파일 있습니다');
	                     parent_div.remove();
	                     ck = false;
	                  }
               	  })

                  if(ck){
                    file.upload = Upload.upload({
                        url: configService.shopPublicUrl+"test/upload",
                        method: 'POST',
                        file:file,
                        fileFormDataName:"fileName",
                        fields: {
                           'filepath':$scope.filesavePath
                        }
                    }).
                    then(function(response) {

                        response
                        var newfile = {};
                        var path = response.data.file_path+"/"+response.data.file_name; 
                        newfile.src="../"+path;
                        newfile.number=response.data.file_idx;
                        if(imgvalidate.test(file[0].type))
                        {
                           $('.file_img').last().attr('src',newfile.src);
                        }
                        else
                        {
                           $('.file_img').last().attr('src','image/ic_insert_drive_file_black_48dp_2x.png');
                           parent_div[0].children[0].children[3].remove();
                           parent_div[0].children[0].children[3].remove();
                        }              
                        parent_div.addClass(''+newfile.number);
                        parent_div.addClass('img_list');
                        parent_div.addClass(newfile.src);
                        $scope.fileList.push(newfile.number);
                        $scope.imgList.push(newfile.src);
                        $scope.cnt++;

                   }, function(resp){
                      alert('실패');
                      $(parent_div).remove();


                   }, function(evt){
                      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                      $scope.percent = progressPercentage;
                      $('.progress-bar_'+$scope.cnt).css('width', progressPercentage+'%');
                   });
                   }
               }
            }

            $scope.delete = function(idx){ //삭제 함수 
                 uploadfactory.delete({id:idx});
            }
        }//link end
    }//return end
})//directive end

mall.directive("makeFileDiv", function($compile,configService){
   return{
      restrict:"E",
      templateUrl : configService.shopPublicUrl + "template/admin/upload/make_file_div.html",
      link: function($scope){   
         $('.progress-bar').last().addClass('progress-bar_'+$scope.cnt);
         $('.img_list span').last().append($scope.spanfilename);

     
        $scope.sel_title = function(e,val) //타이틀 지정
        {
            $('.md-warn').removeClass('md-warn');
            $(e.currentTarget).addClass('md-warn');
            var title = $(e.currentTarget)[0].parentElement.classList[2];
            if(title == null)
            {
               title = $(e.currentTarget)[0].parentElement.parentElement.classList;
               title = title[title.length-1];
            }
            $scope.itemList.p_big_img = title;
            $scope.DefalutImage = title;
         }

        $scope.sel_insert = function(e) //이미지 컨텐츠 삽입
        {
            var src = $(e.currentTarget)[0].parentElement.children[1].src;
            $scope.ck.insertHtml("<img src='" +src+ "'>");
        }


        $scope.sel_delete = function(e) //이미지 삭제
        {
            var check = $(e.currentTarget)[0].parentElement.children[3].classList;
            var reitem = true;
            angular.forEach(check, function(value, key)
            {
               if(value == 'md-warn')
               {
                  alert("타이틀 지정 이미지는 삭제가 불가능합니다.");
                  reitem = false;
                  return;
               }
            });

            if(reitem)
            {
               var idx = $(e.currentTarget)[0].parentElement.parentElement.classList[1];
               if(idx == 'layout-align-center-center' || idx == 'layout-wrap')
               {
                  idx = $(e.currentTarget)[0].parentElement.classList[1];
               }
         
               setTimeout(function()
               {
                  $scope.delete(idx);
                   $('.'+idx).remove();
                   $('md-tooltip').remove();   
               },200)

               $scope.fileList = jQuery.grep($scope.fileList, function(value) 
               {
                  return value != idx;
               });   
            }
     	}

      }
   }
});