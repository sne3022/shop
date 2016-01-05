<?php namespace sneboard_shop\Http\Controllers\Shop;

use sneboard_shop\Http\Controllers\Controller;
use sneboard_shop\Contracts\Shop\ICategory;
use Request;
class CategoryController extends Controller{

	private $category;
	public function __construct(ICategory $category){
		$this->category = $category;
	}

	public function index()
	{ //전체 상품 보여주기
		return $this->category->CategoryList();
	}

	public function show($id) //해당 상품 불러오기
	{ 
		return $this->category->CategoryGet($id);
	}

	public function store() //서버에 상품 저장
	{			
		//dd(Request::input('category'));
		$this->category->CategoryAdd(Request::input('category'), Request::input('category_status'), Request::input('category_url'));
	}

	public function update()
	{
		$this->category->CategoryUpdate(Request::input('id'));
	}
	public function destroy($id)//angular delete() -> 서버에 저장된 상품 삭제
	{	
		$this->category->CategoryDelete($id, Request::input('type'));
	}
}