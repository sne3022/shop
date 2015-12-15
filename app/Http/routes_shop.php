<?php 

Route::controller("shop", "Shop\TestController");
Route::resource("mall", "Shop\MallItemController");
Route::resource("option", "Shop\MallOptionController");

/* 파일업로드 */
Route::controller('test', 'Shop\UploadController');
Route::resource('upload', 'Shop\ModuleController');