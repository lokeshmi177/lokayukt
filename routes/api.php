<?php

use App\Http\Controllers\api\LoginController;
use Illuminate\Support\Facades\Route;

Route::post('/login',[LoginController::class,'login']);