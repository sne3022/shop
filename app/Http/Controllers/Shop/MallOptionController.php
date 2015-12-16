<?php namespace sneboard_shop\Http\Controllers\Shop;

use sneboard_shop\Http\Controllers\Controller;
use sneboard_shop\Contracts\Shop\IOption;
use Request;
class MallOptionController extends Controller{

	private $option;
	public function __construct(IOption $option)
	{
		$this->option = $option;
	}

	public function index()
	{ 
		return $this->option->OptionList();
	}

	public function show($id) //해당 상품 불러오기
	{ 
		return $this->option->OptionGet($id);
	}

	public function update()
	{
		$optionObj = Request::input('id');
		$this->option->OptionUpdate($optionObj);
	}

	public function store() //서버에 상품 저장
	{
		$this->option->OptionInsert(Request::input('option'));
	}

	public function destroy($id)//angular delete() -> 서버에 저장된 상품 삭제
	{	
		if(Request::input('type')==1)
		{
			$this->option->OptionDelete($id);
		}
		else if(Request::input('type')==2)
		{
			$this->option->OptionMultipleDelete($id);
		}
	}

}