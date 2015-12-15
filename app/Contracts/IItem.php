<? namespace App\Contracts;

interface IItem{
	public function ItemAdd($item);
	public function ItemDelete($product_code);
	public function ItemUpdate($item, $type);
	public function ItemList();
}