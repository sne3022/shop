<?php namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
class TestController extends Controller{

	public function getIndex()
	{
		return view('mall/main');
	//	return view("20151029");
	}

}