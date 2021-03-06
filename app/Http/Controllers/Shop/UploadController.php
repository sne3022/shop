<?php namespace sneboard_shop\Http\Controllers\Shop;

use sneboard_shop\Http\Requests;
use sneboard_shop\Http\Controllers\Controller;
use Request;
use Illuminate\Contracts\Auth\Guard;
use sneboard_shop\Contracts\Shop\IFile;
use Config;
use File;

class UploadController extends Controller {

	private $file;
	private $path;
	public function __construct(IFile $file){
		$this->file = $file; 
	}

	public function getIndex()
	{ 
		return view('upload/fileupload');
	}
    
	public function postUpload() //파일 업로드
	{
		$filepath =Request::input('filepath'); //파일 경로
		$fileupload = $this->file->FileUpload(Request::file('file')[0],$_SERVER['DB_HOST'],$filepath); //파일업로드
		return $fileupload;

	}




}