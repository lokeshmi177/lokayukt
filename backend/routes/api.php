<?php

use App\Http\Controllers\api\CommonController;
use App\Http\Controllers\api\ComplaintsController;
use App\Http\Controllers\api\LoginController;
use App\Http\Controllers\api\UserManagement;
use Illuminate\Support\Facades\Route;

Route::post('/login',[LoginController::class,'login']);

Route::middleware('auth:sanctum')->group(function(){

Route::post('/logout', [LoginController::class, 'logout']);

Route::get('/all-district',[CommonController::class,'fetch_district']);

Route::post('/complaints',[ComplaintsController::class,'complaint_register']);

Route::get('/check-duplicate',[ComplaintsController::class,'checkDuplicate']);

Route::get('/progress-register',[ComplaintsController::class,'progress_report']);

//USER-MANAGEMENT

Route::post('/user-management',[UserManagement::class,'user_management']);

});
