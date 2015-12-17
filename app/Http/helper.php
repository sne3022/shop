<?
function shopPath($path, $secure=null)
{
	return app('url')->asset($path, $secure);
}