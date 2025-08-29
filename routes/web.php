<?php

use App\Http\Controllers\web\LoginController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::match(['get','post'],'/login',[LoginController::class,'index']);
