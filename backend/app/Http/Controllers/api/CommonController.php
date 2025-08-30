<?php

namespace App\Http\Controllers\api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\District;
use Illuminate\Http\Request;

class CommonController extends Controller
{
    public function fetch_district(){

        $district=District::get();
        // dd($district->toArray());
        return ApiResponse::generateResponse('success','District fetch successfully',$district);
    }
}
