<?php namespace sneboard_shop\Http\Controllers\Shop;

use sneboard_shop\Http\Requests;
use sneboard_shop\Http\Controllers\Controller;
use Request;
use Illuminate\Contracts\Auth\Guard;
use sneboard_shop\Contracts\Shop\IFile;


class ModuleController extends Controller {

	private $file;
	public function __construct(IFile $file){
		$this->file = $file;
	}

	public function index(){ //angular show()
	
	}

	public function show($id) //angular get($id) 서버에 해당 이미지 불러오기
	{ 
		  $id = explode(',',$id);
	      $filelist = [];
	      foreach($id as $value){
	         array_push($filelist,$this->file->getFileOrigin($value));
	      }
     	 return $filelist;
	}

	public function store() //anguluar save 서버에 이미지 저장
	{
		}

	public function destroy($id)//angular delete() -> 서버에 저장된 이미지 삭제
	{	
		$this->file->FileDelete($id);
	}

}