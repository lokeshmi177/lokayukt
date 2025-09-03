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

/**
 * Designation
 */
Route::get('/department',[CommonController::class,'fetch_department']);
Route::post('/add-department',[CommonController::class,'addDepartment']);
Route::post('/edit-department/{id}',[CommonController::class,'editDepartment']);


/**
 * Designation
 */
Route::get('/designation',[CommonController::class,'fetch_designation']);
Route::post('/add-designation',[CommonController::class,'addDesignation']);
Route::post('/edit-designation/{id}',[CommonController::class,'editDesignation']);

/**
 * Subject
 */
Route::get('/subjects',[CommonController::class,'fetch_subject']);
Route::post('/add-subject',[CommonController::class,'addSubject']);
Route::post('/edit-subject/{id}',[CommonController::class,'editSubject']);

/**
 * Complain Type
 */
Route::get('/complainstype',[CommonController::class,'fetch_complainstype']);
Route::post('/add-complainstype',[CommonController::class,'addComplainType']);
Route::post('/edit-complainstype/{id}',[CommonController::class,'editComplainType']);

/**
 * Rejection Reason
 */
Route::get('/rejections',[CommonController::class,'fetch_rejection']);
Route::post('/add-rejection',[CommonController::class,'addRejection']);
Route::post('/edit-rejection/{id}',[CommonController::class,'editRejection']);

});
