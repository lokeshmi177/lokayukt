<?php

use App\Http\Controllers\api\Admin\AdminDashboardController;
use App\Http\Controllers\api\Admin\AdminReportController;
use App\Http\Controllers\api\CommonController;
use App\Http\Controllers\api\ComplaintsController;
use App\Http\Controllers\api\LoginController;
use App\Http\Controllers\api\UserManagement;
use Illuminate\Support\Facades\Route;

Route::post('/login',[LoginController::class,'login']);

Route::middleware('auth:sanctum')->group(function(){

    Route::post('/logout', [LoginController::class, 'logout']);


    Route::prefix('admin')->group(function () {
        
        Route::get('/all-district',[CommonController::class,'fetch_district']);

        Route::post('/complaints',[ComplaintsController::class,'complaint_register']);
        Route::post('/all-complaints',[ComplaintsController::class,'allComplainsDashboard']);
        Route::post('/all-pending-complaints',[ComplaintsController::class,'allComplainsDashboardPending']);
        Route::post('/all-approved-complaints',[ComplaintsController::class,'allComplainsDashboardApproved']);
        Route::post('/all-rejected-complaints',[ComplaintsController::class,'allComplainsDashboardRejected']);

        Route::get('/check-duplicate',[ComplaintsController::class,'checkDuplicate']);

        Route::get('/progress-register',[ComplaintsController::class,'progress_report']);

        //USER-MANAGEMENT

        Route::post('/add-user',[UserManagement::class,'user_management']);
        Route::get('/users',[UserManagement::class,'index']);
        Route::get('/edit-users/{id}',[UserManagement::class,'editUser']);
        Route::post('/update-users/{id}',[UserManagement::class,'updateUser']);
        Route::post('/delete-users/{id}',[UserManagement::class,'deleteUser']);

        /**
         * District
         */
        Route::get('/district',[CommonController::class,'fetch_district']);
        Route::post('/add-district',[CommonController::class,'addDistrict']);
        Route::post('/edit-district/{id}',[CommonController::class,'editDistrict']);
        Route::post('/delete-district/{id}',[CommonController::class,'removeDistrict']);
        /**
         * Designation
         */
        Route::get('/department',[CommonController::class,'fetch_department']);
        Route::post('/add-department',[CommonController::class,'addDepartment']);
        Route::post('/edit-department/{id}',[CommonController::class,'editDepartment']);
        Route::post('/delete-department/{id}',[CommonController::class,'removeDepartment']);


        /**
         * Designation
         */
        Route::get('/designation',[CommonController::class,'fetch_designation']);
        Route::post('/add-designation',[CommonController::class,'addDesignation']);
        Route::post('/edit-designation/{id}',[CommonController::class,'editDesignation']);
        Route::post('/delete-designation/{id}',[CommonController::class,'removeDesignation']);

        /**
         * Subject
         */
        Route::get('/subjects',[CommonController::class,'fetch_subject']);
        Route::post('/add-subject',[CommonController::class,'addSubject']);
        Route::post('/edit-subject/{id}',[CommonController::class,'editSubject']);
        Route::post('/delete-subject/{id}',[CommonController::class,'removeSubject']);

        /**
         * Complain Type
         */
        Route::get('/complainstype',[CommonController::class,'fetch_complainstype']);
        Route::post('/add-complainstype',[CommonController::class,'addComplainType']);
        Route::post('/edit-complainstype/{id}',[CommonController::class,'editComplainType']);
        Route::post('/delete-complainstype/{id}',[CommonController::class,'removeComplainstype']);

        /**
         * Rejection Reason
         */
        Route::get('/rejections',[CommonController::class,'fetch_rejection']);
        Route::post('/add-rejection',[CommonController::class,'addRejection']);
        Route::post('/edit-rejection/{id}',[CommonController::class,'editRejection']);
        Route::post('/delete-rejection/{id}',[CommonController::class,'removeRejection']);



        Route::get('/complain-report',[AdminReportController::class,'complainReports']);
        Route::get('/all-complains',[AdminReportController::class,'allComplains']);

        Route::get('/detail-by-complaintype',[AdminReportController::class,'complainComplaintypeWise']);




        Route::get('/district-wise-complaint',[AdminReportController::class,'complainDistrictWise']);
        Route::get('/department-wise-complaint',[AdminReportController::class,'complainDepartmentWise']);
        Route::get('/montly-trends',[AdminReportController::class,'getMontlyTrends']);
        Route::get('/compliance-report',[AdminReportController::class,'complianceReport']);
        
        // Daishboard
        Route::get('/dashboard/{date}',[AdminDashboardController::class,'index']);
        Route::get('/montly-complaint',[AdminDashboardController::class,'getDistrictGraph']);
        Route::get('/district-wise-company-type',[AdminDashboardController::class,'getdistrictWiseCompanyTypeGraph']);
        Route::get('/status-distribution',action: [AdminDashboardController::class,'gestatusDistribution']);
    });

});


