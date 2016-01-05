<? namespace sneboard_shop\Contracts\Shop;

interface ICategory
{
	public function CategoryAdd($category, $type, $url);
	public function CategoryDelete($category, $type);
	public function CategoryUpdate($category);
	public function CategoryList();
	public function CategoryGet($c_parent);
}