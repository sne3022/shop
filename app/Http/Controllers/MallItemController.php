<?php namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Contracts\IItem;
use Request;
class MallItemController extends Controller{

	private $item;
	public function __construct(IItem $item){
		$this->item = $item;
	}

	public function index(){ //전체 상품 보여주기
		return $this->item->ItemList();
	}

	public function show($id) //해당 상품 불러오기
	{ 
		return $this->item->ItemGet($id);
	}

	public function store() //서버에 상품 저장
	{
		$this->item->ItemAdd(Request::input("item"));
	}

	public function update()
	{
		$itemObj = Request::input('id');
		$this->item->ItemUpdate($itemObj);
	}
	public function destroy($id)//angular delete() -> 서버에 저장된 상품 삭제
	{	
		$this->item->ItemDelete($id);
	}

}