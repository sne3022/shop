<? namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class option extends Model
{
	protected $fillable = array('o_idx',
							    'o_code',
		                        'o_field_name',
		                        'o_field_name_txt',
		                        'o_value',
		                        'o_select_box',
		                        'o_order',
		                        'o_all_status',
		                        'o_type'
	);
	protected $primaryKey = "o_idx";
	protected $table="sb_mall_option";
	public $timestamps = false;
}