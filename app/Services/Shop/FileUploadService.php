<?php namespace App\Services\Shop;

use App\Contracts\Shop\IFile;
use Request;
use App\Models\Shop\fileupload;
use App\Http\Helpers\FileUploader;
use Response;
use File;

class FileUploadService implements IFile
{

  public function FileUpload($fileRequest, $serverIp, $filepath)
  {
    $file_origin_name = iconv('utf-8', 'euc-kr', $fileRequest->getClientOriginalName());//한글 파일 가능
    $file_size = $fileRequest->getClientSize(); //파일 크기
    $file_ext = $fileRequest->getClientOriginalExtension();//파일확장자
    $file_name = date('YmdHis').".".$file_ext; //파일이름
    $file_path = "storage/uploads";//파일 기본주소

    date_default_timezone_set("Asia/Seoul"); //한국 시간적용
    $file_copy_date = date('Y-m-d H:i:s');
    $fileRequest->move(storage_path().'/uploads', $file_name);//파일복사
    

    $file_origin_name= iconv('euc-kr','utf-8',$file_origin_name);//변환후 파일 경로 넘겨주기
    $newfileupload = new fileupload();
    $newfileupload->file_origin_name=$file_origin_name;
    $newfileupload->file_name=$file_name;
    $newfileupload->file_path=$file_path;
    $newfileupload->file_copy_date=$file_copy_date;
    $newfileupload->file_size=$file_size;
    $newfileupload->file_server_ip=$serverIp;
    $newfileupload->save();

    return $newfileupload; //파일 저장한 객체
   }

   public function FileDelete($file_idx) //이미지 파일명을 배열로 받는다.
   {
      $file = fileupload::find($file_idx); 
      $fullPath = storage_path(). "\\uploads\\" . $file->file_name;
      /* file과 DB 데이터 동시 삭제 */
      unlink($fullPath);
      $file->delete();
   }

   public function getImages() //저장된 이미지 불러오기
   {
      $saveImage = fileupload::get();
      return $saveImage;
   }

   public function titleImage($file_name)
   {
      $file_idx = fileupload::where('file_name', $file_name)->pluck('file_idx');
      return $file_idx;   
   }

	public function getFilePath($file_idx){
		$file_list = fileupload::where('file_idx',$file_idx)->get();
		return $file_list[0]->file_path."/".$file_list[0]->file_name;		
	}  

	public function getFileOrigin($file_idx){
		$file_list = fileupload::where('file_idx',$file_idx)->get();
		return $file_list[0];
	}

	public function FileDeleteBoard($file_idx){
		fileupload::where('file_idx',$file_idx)->delete();
	}

	public function getFileName($file_idx){
		$file_list = fileupload::where('file_idx',$file_idx)->get();
		return $file_list[0]->file_name;	}

}