<? namespace sneboard_shop\Models\Shop;

use Illuminate\Database\Eloquent\Model;

class option extends Model
{
	protected $fillable = array('o_idx',
							    'o_code',
		                        'o_field_name',
		                        'o_field_name_txt',
		                        'o_field_name_color',
		                        'o_field_name_fontsize',
		                        'o_field_name_fontfamily',
		                        'o_value',
		                        'o_value_color',
		                        'o_value_fontsize',
		                        'o_value_fontfamily',
		                        'o_select_box',
		                        'o_order',
		                        'o_all_status',
		                        'o_type'
	);
	protected $primaryKey = "o_idx";
	protected $table="sb_mall_option";
	public $timestamps = false;
}