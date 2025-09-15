<?php

namespace App\Http\Controllers\api\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\ComplaintAction;
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
        ->leftJoin('forward_reports as rep', 'complaints.id', '=', 'rep.complain_id')
        ->select(
            'complaints.*',
            'dd.district_name as district_name',
            'dp.name as department_name',
            'ds.name as designation_name',
            'ct.name as complaintype_name',
            'sub.name as subject_name',
            // 'rep.*',
            'rep.forward_to_so_us as forward_so',
            'rep.forward_to_ds_js as forward_ds',
            'rep.forward_to_sec as forward_sec',
            'rep.forward_to_cio_io as forward_cio',
            'rep.forward_to_lokayukt as forward_lokayukt',
            'rep.forward_to_uplokayukt as forward_uplokayukt',
            'rep.forward_by_so_us as by_so',
            'rep.forward_by_ds_js as by_ds',
            'rep.forward_by_sec as by_sec',
            'rep.forward_by_cio_io as by_cio',
            'rep.forward_by_lokayukt as by_lokayukt',
            'rep.forward_by_uplokayukt as by_uplokayukt',

        );
        // ->where('form_status', 1)
        // ->where('approved_by_ro', 1);

    switch ($userSubrole) {
        case "so-us":
            $query->where('form_status', 1)
                  ->where('approved_by_ro', 1)
                  ->where('approved_by_ro', 1);
            // $query->where('complaints.added_by', $user);
            break;

        case "ds-js":
          $query->where('form_status', 1)
                  ->where('approved_by_ro', 1)
                  ->where('forward_so', 1)
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
    //    dd($request->all());
        $validation = Validator::make($request->all(), [
            'action_taken_by' => 'required|exists:users,id',
            'forwarded_to' => 'required|exists:users,id',
            // 'remark' => 'required',
         
          
        ], [
            'action_taken_by.required' => 'Forward by Supervisor is required.',
            'action_taken_by.exists' => 'Forward by user does not exist.',
            'forwarded_to.required' => 'Forward to user is required.',
            'forwarded_to.exists' => 'Forward to user does not exist.',
            // 'remark.required' => 'Remark is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }
        if(isset($complainId) && $request->isMethod('post')){

             $cmp =  Complaint::findOrFail($complainId);

            if($cmp){
                $cmpAction =new ComplaintAction();
                $cmpAction->complaint_id = $complainId;
                $cmpAction->action_taken_by = $request->action_taken_by;
                $cmpAction->forwarded_to = $request->forwarded_to;
                $cmpAction->action_type = "Forwarded";
                $cmpAction->remarks = $request->remarks;
                $cmpAction->save();
            }
            // $cmp->forward_by = $request->forward_by;
            // $cmp->forward_to_d_a = $request->forward_to_d_a;
            // $cmp->sup_status = 1;
            // $cmp->save();
    
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
