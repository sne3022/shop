<?php namespace sneboard_shop\Services\Shop;

use sneboard_shop\Models\Shop\item;
use sneboard_shop\Contracts\Shop\IItem;
class ItemService implements IItem{

	public function ItemAdd($item)
	{
		$itemObj = new item();
		$itemObj->fill($item);
		$itemObj->save(); 
	}

	public function ItemUpdate($item, $type)
	{	
		if($type==1)
		{
			$itemObj =item::find($item['p_code']);
			$itemObj->fill($item);
			$itemObj->save();
		}
		else if($type==2)
		{
			foreach ($item as $itemArray) 
			{
				$itemObj =item::where('p_idx', $itemArray['p_idx'])->update([
					'p_order'=>$itemArray['p_order']
				]);
			}
		}
		else if($type==3)
		{
			$itemObj = item::find($item['p_code']);
			dd($item);

			$itemObj->fill($item);
			$itemObj->save();
		}
	}
	
	public function ItemDelete($product_code)
	{
		item::where("p_code", $product_code)->delete();
	}

	public function ItemList()
	{
		$list = item::orderBy('p_order', 'asc')->get(); //상품정보
		return $list;
	}
	public function ItemGet($product_code)
	{
		$list = item::where("p_code", $product_code)->first();
		return $list;
	}

}