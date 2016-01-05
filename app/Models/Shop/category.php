<? namespace sneboard_shop\Models\Shop;

use Illuminate\Database\Eloquent\Model;

class category extends Model
{
	protected $fillable = array('c_idx', 
								'c_depth', 
								'c_parent',
								'c_group', 
								'c_name',
								'c_url',
								'c_description',
								'c_status'
								);
	protected $primaryKey = "c_idx";
	protected $table="sb_mall_category";
	public $timestamps = false;
}