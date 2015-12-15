<? namespace App\Models\Shop;

use Illuminate\Database\Eloquent\Model;

class item extends Model
{
	protected $fillable = array('p_idx',
		                        'p_code',
		                        'p_title',
		                        'p_price',
		                        'p_quantity',
		                        'p_big_img',
		                        'p_small_img',
		                        'p_contents',
		                        'p_order',
		                        'p_status',
		                        'p_upload_idx',
	);

	protected $primaryKey = "p_idx";
	protected $table="sb_mall_product";
	public $timestamps = false;
}