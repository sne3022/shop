<?php namespace sneboard_shop\Services\Shop;

use sneboard_shop\Contracts\Shop\ICategory;
use sneboard_shop\Models\Shop\category;

class CategoryService implements ICategory
{
	public function CategoryAdd($category, $type, $url)
	{
		if($type=="left")
		{
			$maxGroupNumber = category::max('c_group');
			if($maxGroupNumber == null)
			{
				$maxGroupNumber=0;
			}
			$category['c_group'] =$maxGroupNumber+1;
		}

		$maxIdxNumber =category::max('c_idx')+1;
		$category['c_url'] = $url.$maxIdxNumber;

		$list = new category();
		$list->fill($category);
		$list->save();
	}

	public function CategoryUpdate($category)
	{
		$categoryObj = category::find($category['c_idx']);
		$categoryObj->fill($category);
		$categoryObj->save();

	}

	public function CategoryList()
	{
		$list = category::get(); 
		return $list;
	}
	public function CategoryDelete($idx, $type)
	{
		if($type=="left") //대분류 삭제
		{
			$categoryGroup = category::where('c_idx', $idx)->value('c_group'); //전체 그룹 정보
			category::where('c_group', $categoryGroup)->delete(); //모든그룹 삭제
		}
		else if($type=="center") //중분류 삭제
		{
			category::where('c_idx', $idx)->delete();
			$categoryObj = category::where('c_group',$idx)->get(); //하위그룹 정보 
			if($categoryObj!=null)
			{
				category::where('c_parent',$idx)->delete(); //하위그룹삭제
			}
			
		}
		else if($type=="right") //소분류 삭제
		{
			category::where('c_idx', $idx)->delete(); 	
		}

	}

	public function CategoryGet($category_parent)
	{
		$list = category::where('c_parent', $category_parent)->get();
		return $list;
	}
}	