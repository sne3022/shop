<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Request;
use Illuminate\Contracts\Auth\Guard;
use App\Contracts\IFile;
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