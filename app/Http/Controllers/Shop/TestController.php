<?php namespace sneboard_shop\Http\Controllers\Shop;

use sneboard_shop\Http\Controllers\Controller;
class TestController extends Controller{

	public function getIndex()
	{
		return view('mall/main');
	//	return view("20151029");
	}

}