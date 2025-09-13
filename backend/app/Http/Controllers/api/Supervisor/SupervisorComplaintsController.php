<?php

namespace App\Http\Controllers\api\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SupervisorComplaintsController extends Controller
{
    public function allComplains(){
        $user = Auth::user()->id;
        // dd($user);
      $userSubrole = Auth::user()->subrole->name; 
   
    if ($userSubrole) {
    $query = DB::table('complaints')
        ->leftJoin('district_master as dd', 'complaints.district_id', '=', 'dd.district_code')
        ->leftJoin('departments as dp', 'complaints.department_id', '=', 'dp.id')
        ->leftJoin('designations as ds', 'complaints.designation_id', '=', 'ds.id')
        ->leftJoin('complaintype as ct', 'complaints.complaintype_id', '=', 'ct.id')
        ->leftJoin('subjects as sub', 'complaints.subject_id', '=', 'sub.id')
        ->leftJoin('report as rep', 'complaints.id', '=', 'rep.complaint_id')
        ->select(
            'complaints.*',
            'dd.district_name as district_name',
            'dp.name as department_name',
            'ds.name as designation_name',
            'ct.name as complaintype_name',
            'sub.name as subject_name',
            'rep.',
        );
        // ->where('form_status', 1)
        // ->where('approved_by_ro', 1);

    switch ($userSubrole) {
        case "so-us":
            $query->where('form_status', 1)
                  ->where('approved_by_ro', 1);
            // $query->where('complaints.added_by', $user);
            break;

        case "ds-js":
          $query->where('form_status', 1)
                  ->where('approved_by_ro', 1)
                  ->where('forward_to_lokayukt', 1)
                  ->whereOr('forward_to_uplokayukt', 1);
            break;

        case "sec":
           $query->where('form_status', 1)
                  ->where('approved_by_ro', 1)
                   ->where('forward_to_lokayukt', 1)
                  ->whereOr('forward_to_uplokayukt', 1);
            break;

        case "cio-io":
           $query->where('form_status', 1)
                  ->where('approved_by_ro', 1)
                   ->where('forward_to_lokayukt', 1)
                  ->whereOr('forward_to_uplokayukt', 1);
            break;

        case "dea-assis":
          $query->where('form_status', 1)
                  ->where('approved_by_ro', 1);
            break;

        default:
            return response()->json([
                'status' => false,
                'message' => 'Invalid subrole',
                'data' => [],
            ], 400);
    }

    $records = $query->get();

    return response()->json([
        'status' => true,
        'message' => 'Records fetched successfully',
        'data' => $records,
    ]);
}

}
     public function viewComplaint($id)
     {
        $complainDetails = DB::table('complaints as cm')
        ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
        ->leftJoin('departments as dp', 'cm.department_id', '=', 'dp.id')
        ->leftJoin('designations as ds', 'cm.designation_id', '=', 'ds.id')
        ->leftJoin('complaintype as ct', 'cm.complaintype_id', '=', 'ct.id')
        ->leftJoin('subjects as sub', 'cm.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
        ->select(
            'cm.*',
            'dd.district_name',
            'dp.name as department_name',
            'ds.name as designation_name',
            'ct.name as complaintype_name',
            'sub.name as subject_name'
        )
        ->where('cm.id', $id)
        ->first();

            

            return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' => $complainDetails,
            ]);
    }


    public function forwardbySO(Request $request,$complainId){
         $validation = Validator::make($request->all(), [
            'forward_by' => 'required|exists:users,id',
            'forward_to_d_a' => 'required|exists:users,id',
         
          
        ], [
            'forward_by.required' => 'Forward by Supervisor is required.',
            'forward_by.exists' => 'Forward by Supervisor does not exist.',
            'forward_to_d_a.required' => 'Forward to Dealing Assistant is required.',
            'forward_to_d_a.exists' => 'Forward to Dealing Assistant does not exist.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }
        if(isset($complainId) && $request->isMethod('post')){

            $cmp =  Complaint::findOrFail($complainId);
            $cmp->forward_by = $request->forward_by;
            $cmp->forward_to_d_a = $request->forward_to_d_a;
            $cmp->sup_status = 1;
            $cmp->save();
    
             return response()->json([
                    'status' => true,
                    'message' => 'Forwarded Successfully',
                    'data' => $cmp
                ], 200);
        }else{
            
             return response()->json([
                    'status' => false,
                    'message' => 'Please check Id'
                ], 401);
        }

    }
}
