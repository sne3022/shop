<? namespace sneboard_shop\Contracts\Shop;

interface IOption{
	public function OptionInsert($option, $type);
	public function OptionDelete($option_idx);
	public function OptionMultipleDelete($option_code);
	public function OptionUpdate($option);
	public function OptionList();
	public function OptionGet($option_code);
}