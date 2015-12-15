<? namespace App\Contracts\Shop;

interface IFile
{
	public function FileUpload($fileRequest,$serverIp, $filepath); //파일 업로드 하기
	public function FileDelete($file_origin_name); //파일 지우기
	public function getImages(); //모든 이미지 가져오기
	public function titleImage($file_name);
	public function getFilePath($file_idx);
	public function getFileOrigin($file_idx);
}