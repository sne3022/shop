var mall = angular.module('mallController', ['ui.bootstrap', 'ngMaterial', 'ngFileUpload', 'ngSanitize']);
mall.$inject = ["$scope","$routeParams","baseUrl","mallfactory", "optionfactory", "itemService", "Upload", "uploadfactory"];

mall.controller("AdminCtrl", function($scope){
	$scope.itemEditList = null;
	$scope.fileName = null;
	$scope.normal = 'insert';
	$scope.control = function(number){
		if(number==1)
		{
			$scope.normal = 'insert';  
		}
		else if(number==2)
		{
			$scope.normal = 'manage';
			CKEDITOR.remove('contents');	
		}
	}

})

/******************************************* 상품 리스트 ***************************************/
mall.controller("ItemListController", function($scope, mallfactory)
{
	$scope.totalItemNumber = 0; //상품 총개수 초기화
    $scope.itemperpage = 9; //페이지당 상품 표시 개수
    $scope.currentPage = 1; //현재 페이지 표시
    getItems(); //상품 가져오기 
    $scope.items =[]; //상품을 담는 공간

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
})


/******************************************* 상품 자세히 보기 ***************************************/
mall.controller("ItemDetailController", function($scope, $routeParams, mallfactory, optionfactory, itemService, $sce, uploadfactory)
{	
 		
	$scope.optionList = []; //상품 옵션을 담을 공간
	$scope.user = [];
	$scope.trustAsHtml = function(html) 
    {
      return $sce.trustAsHtml(html);
    }
    
    ItemRead();
    function ItemRead()
    {
    	mallfactory.get({id:$routeParams.id}).$promise.then(function(result)
		{					
			$scope.item = result; //전체 상품 정보
			$scope.idx = $scope.item.p_idx;// 상품 번호
			$scope.code = $scope.item.p_code; //상품 코드
			$scope.sImg = []; //작은 이미지 정보 담을 공간
			$scope.bImg = $scope.item.p_big_img; //큰 이미지 정보
			$scope.contents = $scope.item.p_contents; //상품 설명
			$scope.quantity =1; //수량 초기값
			$scope.totalQuantity = $scope.item.p_quantity; //상품 수량

			$scope.title = $scope.item.p_title; //상품 타이틀
			$scope.o_price = $scope.item.p_price; //옵션 가격
			$scope.p_price = $scope.item.p_price; //상품 가격
			$scope.origin_price = $scope.item.p_price; //상품 기본 가격

			/* 작은 이미지 정보 (,) 기준 나눠 담기 */
			$scope.sImg =[];

			var str = $scope.item.p_small_img;
			if(str != null)
			$scope.Img = str.split(",");
			angular.forEach($scope.Img, function(value)
			{
				uploadfactory.get({id:value}).$promise.then(function(result)
				{ 
			            img_file_path = '../'+result.file_path + '/' + result.file_name;		
						$scope.sImg.push(img_file_path);
				})
			})
			OptionRead();
		}); 
		/* 해당 상품 데이터 가져오기 */ 
		
    }
	
    function OptionRead()
    {
		/* 옵션 데이터 불러오기 */
		optionfactory.query({id:$routeParams.id}).$promise.then(function(result)
		{
			/* 옵션 데이터 사이즈 설정 */
			$scope.optionList = result; 
			$scope.selectedOption =[]; //옵션 추가
			$scope.sizeList = []; //옵션의 내용 추가

			if(result.length==0){
				$scope.optionList=''; 
				
			}

			else
			{
				//옵션 기능 있는지 확인
				$scope.optionList = $.grep($scope.optionList, function(option)
				{
					if(option.o_field_name=='옵션'&&option.o_all_status=='y') //옵션 SELECT + 사용 유무 y 일경우
					{ 
						$scope.selectedOption.push(option);
						$scope.option_price = Number(option.o_value); 
						$scope.o_price += $scope.option_price; //옵션이 있으면 기본값 + 옵션값

						var str = option.o_select_box; //옵션 기능 값
						arr = str.split(",");
						$scope.sizeList.push(arr);
					}
					else if(option.o_field_name!='옵션'&& option.o_all_status=='y') //일반 옵션 +  사용 뮤무 y 일경우
					{
						return true;
					}
				})
			}
		}) 
    }
 



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
		$scope.p_price = total_price+$scope.origin_price;
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
		$scope.p_price = total_price-$scope.origin_price;	
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
		if(key=='product')
		{
			$scope.pocketList = {
									'idx':$scope.idx+itemService.getCount(),
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
				itemService.addItem($scope.pocketList);
				location.href="#/cart";
		}

		else if(key=='option')
		{
			if($scope.user.length==0)
			{
				alert("옵션을 선택해주세요.");
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
									'idx':$scope.idx+itemService.getCount(),
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
				itemService.addItem($scope.pocketList);
				location.href="#/cart";
			}
		}
		
	}

	/* 지금 구매하기 */
	$scope.nowBuy = function()
	{

	}

	$scope.showQuantity = function(value)
	{
		$(".quantity_txt").html(value);
		$(".quantity").show();
	}
})	






/************************************ 장바구니 ************************************************/
mall.controller("ItemShoppingbackController", function($scope, $routeParams, itemService)
{
/* 상품코드, 상품 총 가격, 총개수, 선택된 이미지, 선택 옵션*/

	$scope.pocketList = itemService.getItems(); //저장된 상품 가져오기
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

			$scope.pocketList = itemService.clear(); //저장된 상품 배열 초기화
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
mall.directive('itemInsert', function(baseUrl, $document, mallfactory, optionfactory){
	return {
		restrict: 'E',
		templateUrl: baseUrl+'template/admin/iteminsert.html',
		link: function($scope, element, attr){	

		 	var files =''; //이미지 업로드 파일변수
		    $scope.ck = CKEDITOR.replace("contents"); //텍스트 박스
			$scope.p_status = 'y'; //상품 상태 초기화 	
			
			function init()
			{	
				location.reload();
			}

			$scope.itemInsert = function()
			{	

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

				$scope.item.p_code = 'A'+Math.floor((Math.random() * 10000000) + 1);
			    $scope.item.p_contents = $scope.ck.getData(); //설명 
				$scope.item.p_big_img = $scope.itemList.p_big_img; //큰 이미지 
				$scope.item.p_small_img = files; //작은 이미지
				$scope.item.p_status = $scope.p_status;//이미지 표시

				mallfactory.save({item:$scope.item});
				alert("등록 되었습니다");
			}

		}
	}
})


/******************************************* 상품 관리 ****************************************/
mall.directive('itemManage', function(mallfactory, optionfactory, $timeout, $mdDialog, baseUrl){
	return {
		restrict: 'E',
		templateUrl: baseUrl+'template/admin/itemmanage.html',
		link: function(scope, element, attr){	
			var originatorEv;     
			/* 상품 관리 영역 */
			scope.ItemNumber = null;
			scope.ItemNumbers = [1,2,3,4,5,6,7,8,9,10];
			scope.totalItemNumber = 0; //상품 총개수 초기화
		    scope.itemperpage = 3; //페이지당 상품 표시 개수
		    scope.currentPage = 1; //현재 페이지 표시
		    scope.itemList = [];
		    scope.item = {
		    	selected: false
		    }

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
						optionfactory.delete({id:code});
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
				$mdDialog.data = item;
				$mdDialog.show({
					controller:"OptionEditController",
					templateUrl:baseUrl+'template/admin/optionedit.html',
					parent:angular.element(document.body),
					targetEvent:ev,
					clickOutsideToclose:true
				});
			}

			/* 옵션 추가 */
			scope.optionInsert = function(ev,item)
			{
				$mdDialog.add = item;
				$mdDialog.show({
					controller:"OptionInsertController",
					templateUrl:baseUrl+'template/admin/optioninsert.html',
					parent:angular.element(document.body),
					targetEvent:ev,
					clickOutsideToclose:true
				});
			}

			/* 옵션 드롭 */
			scope.optionDrop = function(ev,item)
			{
				$mdDialog.drop = item;
				$mdDialog.show({
					controller:"OptionDropController",
					templateUrl:baseUrl+'template/admin/optiondrop.html',
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

			scope.list = function()
			{
				location.href ="#/list";
			}
		}
	}
})


/******************************************* 상품 수정 ****************************************/
mall.directive('itemEdit', function(mallfactory, $timeout, baseUrl, $compile ,uploadfactory){
	return {
		restrict: 'E',
		templateUrl: baseUrl+'template/admin/itemedit.html',
		controllerAS:"AdminCtrl",
		link: function($scope, element, attr){

			var img = $("<make-file-div>");
			$scope.info = [];
			$scope.itemList= $scope.itemEditList;
			$scope.fileList = [];

			$scope.ck = CKEDITOR.replace("contents",
				{
					height:500
				});

			$scope.ck.setData($scope.itemList.p_contents);
			
			  file_ck_title = $scope.itemList.p_big_img;
			  $scope.fileLists = $scope.itemList.p_small_img.split(',');
		      $scope.fileLists.forEach(function(result){
		         $scope.file_data = uploadfactory.get({id:result}).$promise.then(function(result){
		            file_ck_append = $(result.file_origin_name.split('.')).last()[0];
		            file_ck_name = result.file_name;
		            file_ck_path = result.file_path + '/' + file_ck_name;
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
		    		id:$scope.itemList
		    	}).$promise.then(function(){
		    		alert("변경 되었습니다.");
		    	});
		    }
		}
	}	
})


/******************************************* 옵션 수정 ****************************************/
mall.controller("OptionEditController", function($scope ,$mdDialog, optionfactory)
{
	var str = null;
	$scope.orderProperty = 'o_order';
	getItems();
	function getItems()
	{
		optionfactory.query({id:$mdDialog.data.p_code}).$promise.then(function(result,$index)
		{
			
			$scope.optionList = angular.forEach(result, function(value, index){
				if(value.o_type=="multiple")
				{
					value.o_value = Number(result[index].o_value);
					str = result[index].o_select_box;
					if(str!=null)
					value.o_select_box = str.split(',');
				}
			})
		});
	}	

	$scope.cancel = function() 
	{
    	$mdDialog.cancel();
    }

    $scope.update = function()
    {
    		var option_select_values = '';
	    	
	    	$scope.optionList = angular.forEach($scope.optionList, function(value)
	    	{
	    		if(value.o_select_box!=null)
	    		{
	    			angular.forEach(value.o_select_box, function(result){
	    				 if(option_select_values == '')
					     {
					        option_select_values = option_select_values + result;
					     }
					     else
					     {
					        option_select_values = option_select_values + ',' + result;
					     }	
	    			});
	    			value.o_select_box = option_select_values;
	    		}
	    		
	    	});
    	
    	
    	optionfactory.update({
    		id:$scope.optionList
    	}).$promise.then(function(){
            alert("변경 되었습니다");
    		$mdDialog.hide();
        });
    }
    $scope.cancel = function() 
	{
    	$mdDialog.cancel();
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
				//$("#"+option.o_idx).remove();
				optionfactory.delete({id:option.o_idx});
			}
			else
			{
				return true;
			}
			getItems();	
    	});
    }
})


/******************************************* 옵션 등록 ****************************************/
mall.controller("OptionInsertController", function($scope, $mdDialog, optionfactory)
{
	$scope.option = {};
	$scope.option.o_code = $mdDialog.add.p_code;
	$scope.option.o_all_status = 'y';
	$scope.option.o_other_status = 'y';  
	$scope.add = function()
	{	
		
		if($scope.option.o_field_name_txt!=null && $scope.option.o_value!=null) //제목과 값이 모두 적혀있을경우
		{
			optionfactory.save({option:$scope.option});	
		}
		alert("추가 되었습니다");
		$mdDialog.hide();
	}
	$scope.cancel = function() 
	{
    	$mdDialog.cancel();
    }
})
/* 옵셥 드롭 */
mall.controller("OptionDropController", function($scope, $mdDialog, optionfactory, $compile)
{
	$scope.option = {};
	$scope.option.o_code = $mdDialog.drop.p_code;
	$scope.option.o_field_name="옵션";
	$scope.option.o_all_status = 'y';
//	$scope.option.o_other_status = 'y';
	$scope.option.o_type="multiple"; 
	
	$scope.add = function()
	{	var input_container = $("<md-input-container flex='30'>");
		var input_tag = $("<input>");
		input_tag.addClass('option_number');
		input_tag.attr("type","text");
		input_tag.attr("aria-label", " ");
		input_container.append(input_tag);
		
		$(".add_input").append(input_container);
		$compile(input_container)($scope);
	}

	$scope.cancel = function() 
	{
    	$mdDialog.cancel();
    }

    $scope.insert = function()
    {
    	var option_select_values = '';
    	$(".option_number").each(function(index)
    	{
	    	 if(option_select_values == '')
		     {
		        option_select_values = option_select_values + $(this).val();
		     }
		     else
		     {
		        option_select_values = option_select_values + ',' + $(this).val();
		     }
	    }) 
    	if($scope.option.o_field_name_txt!=null && $scope.option.o_value!=null) //제목과 값이 모두 적혀있을경우
		{
			$scope.option.o_select_box = option_select_values;
			optionfactory.save({option:$scope.option});
			alert("등록 되었습니다");
			$mdDialog.hide();	
		}

    }
})

/* 상품 목록 View */
mall.directive('itemView', function(baseUrl, $document, mallfactory, optionfactory){
	return {
		restrict: 'E',
		templateUrl: baseUrl+'template/view.html',
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


/******************************************* 파일 업로드 ****************************************/
mall.directive('fileupload', function($compile,$timeout,Upload, baseUrl, uploadfactory, $document){
    return{
        restrict: 'E',
        transclude: true,
        templateUrl: baseUrl+'template/admin/fileupload.html',
        link: function($scope, element, attr){  //공유 불가능
           var imgvalidate = /^(?:image\/bmp|image\/gif|image\/jpeg|image\/png|image\/x\-xwindowdump|image\/x\-portable\-bitmap)$/i;
            $scope.filesavePath = attr.src;
            $scope.fileList = [];
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

                 $('.img_list span').each(function(index,result){
                  if(result.innerHTML == file[0].name){
                     alert('같은 파일 있습니다');
                     parent_div.remove();
                     ck = false;
                  }
               })

                  if(ck){
                    file.upload = Upload.upload({
                        url: baseUrl+"test/upload",
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

mall.directive("makeFileDiv", function($compile,baseUrl){
   return{
      restrict:"E",
      templateUrl : baseUrl + "template/admin/make_file_div.html",
      link: function($scope){   
         $('.progress-bar').last().addClass('progress-bar_'+$scope.cnt);
         $('.img_list span').last().append($scope.spanfilename);

     
        $scope.sel_title = function(e,val)
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
         }

        $scope.sel_insert = function(e)
        {
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