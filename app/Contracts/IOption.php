<? namespace App\Contracts;

interface IOption{
	public function OptionInsert($option);
	public function OptionDelete($option_code);
	public function OptionUpdate($option);
	public function OptionList();
	public function OptionGet($option_code);
}