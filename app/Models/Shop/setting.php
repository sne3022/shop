<? namespace sneboard_shop\Models\Shop;

use Illuminate\Database\Eloquent\Model;

class setting extends Model
{
	protected $fillable = array('s_idx',
							    's_width',
		                        's_heigh',
		                        's_row',
		                        's_col',
		                        's_f_size',
		                        's_f_color',
		                        's_type'
	);
	protected $primaryKey = "s_idx";
	protected $table="sb_mall_setting";
	public $timestamps = false;
}
