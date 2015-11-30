<?php namespace App\Services;

use App\Models\option;
use App\Contracts\IOption;
class OptionService implements IOption{

	public function OptionInsert($option)
	{
		$optionObj = new option();
		$optionObj->fill($option);
		$optionObj->save();
	}
	public function OptionList()
	{
		$option = option::get();
		return $option;
	}
	public function OptionGet($option_code)
	{
		$option = option::where('o_code', $option_code)->get();
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

	

}