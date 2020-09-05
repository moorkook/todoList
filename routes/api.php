<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('login', 'AuthenticationController@login')->name('login');
Route::post('createAccount', 'AuthenticationController@createAccount')->name('createAccount');


Route::middleware('auth:api')->group(function () {
    Route::get('logout', 'AuthenticationController@logout')->name('logout');
    Route::prefix('task')->group(function () {
        Route::post('create', 'TaskController@create')->name('createTask');
        Route::post('update', 'TaskController@update')->name('updateTask');
        Route::get('delete', 'TaskController@delete')->name('deleteTask');
        Route::get('getAll', 'TaskController@getAll')->name('getAllTask');
        Route::get('getOne', 'TaskController@getOne')->name('getOneTask');
    });
});
