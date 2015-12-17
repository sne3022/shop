<?php namespace sneboard_shop\Services\Shop;

use sneboard_shop\Models\Shop\option;
use sneboard_shop\Contracts\Shop\IOption;
class OptionService implements IOption{

	public function OptionInsert($option, $type)
	{
		if($type=='default')
		{
			foreach ($option as $value) 
			{
				$optionObj = new option();
				$optionObj->fill($value);
				$optionObj->save();
			}
		}
		else if($type=='insert' || $type=='drop')
		{
			$optionObj = new option();
			$optionObj->fill($option);
			$optionObj->save();
		}
			
	}
	public function OptionList()
	{
		$option = option::get();
		return $option;
	}
	public function OptionGet($option_code)
	{
		$option = option::where('o_code', $option_code)->orderBy('o_order', 'asc')->get();
		return $option;
	}
	public function OptionUpdate($option)
	{
		
		foreach($option as $value) 
		{
			$optionObj =option::find($value['o_idx']);
			$optionObj->fill($value);
			$optionObj->update();
		}
	}
	public function OptionDelete($option_idx) 
	{
		option::where('o_idx',$option_idx)->delete();
	}

	public function OptionMultipleDelete($option_code)
	{
		option::where('o_code', $option_code)->delete();
	}

	

}