<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::controller("shop", "TestController");
Route::resource("mall", "MallItemController");
Route::resource("option", "MallOptionController");

/* 파일업로드 */
Route::controller('test', 'UploadController');
Route::resource('upload', 'ModuleController');

