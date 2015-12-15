<?php namespace App\Http\Controllers\Shop;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Request;
use Illuminate\Contracts\Auth\Guard;
use App\Contracts\Shop\IFile;


class ModuleController extends Controller {

	private $file;
	public function __construct(IFile $file){
		$this->file = $file;
	}

	public function index(){ //angular show()
	
	}

	public function show($id){ //angular get($id) 서버에 해당 이미지 불러오기
		return $this->file->getFileOrigin($id);
	}

	public function store() //anguluar save 서버에 이미지 저장
	{
		}

	public function destroy($id)//angular delete() -> 서버에 저장된 이미지 삭제
	{	
		$this->file->FileDelete($id);
	}

}