<?php 

Route::controller("shop", "Shop\ShopController");

Route::resource("mall", "Shop\MallItemController");
Route::resource("option", "Shop\MallOptionController");
Route::resource("category", "Shop\CategoryController");
/* 파일업로드 */
Route::controller('test', 'Shop\UploadController');
Route::resource('upload', 'Shop\ModuleController');