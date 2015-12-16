<? namespace sneboard_shop\Models\Shop;

use Illuminate\Database\Eloquent\Model;

class fileupload extends Model
{
	protected $fillable = array('file_origin_name', 'file_path', 'file_copy_date', 'file_size','file_server_ip');
	protected $primaryKey = "file_idx";
	protected $table="sb_fileupload";
	public $timestamps = false;
}