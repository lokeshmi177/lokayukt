<?php

namespace App\Http\Controllers\api\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\ComplaintAction;
use App\Models\SubRole;
use App\Models\User;
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
        //  ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')
        ->leftJoin('district_master as dd', 'complaints.district_id', '=', 'dd.district_code')
        // ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
        // ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
        // ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
        // ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id')
        // ->leftJoin('complaint_actions as rep', 'complaints.id', '=', 'rep.complaint_id')
        ->select(
            'complaints.*',
            // 'dd.district_name as district_name',
            // 'dp.name as department_name',
            // 'ds.name as designation_name',
            // 'ct.name as complaintype_name',
            // 'sub.name as subject_name',
            // // 'rep.*',
            // 'rep.forward_by_so_us as forward_so',
            // 'rep.forward_to_ds_js as forward_ds',
            // 'rep.forward_to_sec as forward_sec',
            // 'rep.forward_to_cio_io as forward_cio',
            // 'rep.forward_to_lokayukt as forward_lokayukt',
            // 'rep.forward_to_uplokayukt as forward_uplokayukt',
            // 'rep.forward_by_so_us as by_so',
            // 'rep.forward_by_ds_js as by_ds',
            // 'rep.forward_by_sec as by_sec',
            // 'rep.forward_by_cio_io as by_cio',
            // 'rep.forward_by_lokayukt as by_lokayukt',
            // 'rep.forward_by_uplokayukt as by_uplokayukt',
            //  'cd.department_id',
            //  'cd.officer_name',
            //   'cd.designation_id',
            //    'cd.designation_id',
            //    'cd.category',
            //     'cd.title',
            //     'cd.file',
            //     'cd.subject_id',
            //     'cd.complaintype_id',
            //     'cd.description',
            

        );
//     $query = DB::table('complaints')
//     ->leftJoin('district_master as dd', 'complaints.district_id', '=', 'dd.district_code')
//     ->select(
//         'complaints.*',
//         'dd.district_name as district_name'
//     )
//     // ->where('complaints.id', $id)
//     ->first();

// $query->details = DB::table('complaints_details as cd')
//     ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
//     ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
//     ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
//     ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id')
//     ->select(
//         'cd.*',
//         'dp.name as department_name',
//         'ds.name as designation_name',
//         'ct.name as complaintype_name',
//         'sub.name as subject_name'
//     );
        // ->where('form_status', 1)
        // ->where('approved_by_ro', 1);

    switch ($userSubrole) {
        case "so-us":
            $query->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1);
                //   ->where('approved_by_ro', 1);
            // $query->where('complaints.added_by', $user);
            break;

        case "ds-js":
          $query->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                  ->whereOr('approved_rejected_by_so', 1);
                //   ->where('forward_so', 1)
                //   ->whereOr('forward_to_uplokayukt', 1);
            break;

        case "sec":
           $query->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                   ->where('forward_to_lokayukt', 1)
                  ->whereOr('forward_to_uplokayukt', 1);
            break;

        case "cio-io":
           $query->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                   ->where('forward_to_lokayukt', 1)
                  ->whereOr('forward_to_uplokayukt', 1);
            break;

        case "dea-assis":
          $query->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                   ->where('approved_rejected_by_so', 1)
                    ->whereOr('approved_rejected_by_ds_js', 1);
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
    //    $complainDetails = DB::table('complaints as cm')
    //    ->leftJoin('complaints_details as cd', 'cm.id', '=', 'cd.complain_id')
    // ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
    // ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
    // ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
    // ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
    // ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
    // ->select(
    //     'cm.*',
    //     'dd.district_name',
    //     'dp.name as department_name',
    //     'ds.name as designation_name',
    //     'ct.name as complaintype_name',
    //     'sub.name as subject_name',
    //     // 'cd.*'
    // )
    // ->where('cm.id', $id)
    // ->first();

    $complainDetails = DB::table('complaints as cm')
    ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
    ->select(
        'cm.*',
        'dd.district_name'
    )
    ->where('cm.id', $id)
    ->first();

$complainDetails->details = DB::table('complaints_details as cd')
    ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
    ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
    ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
    ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id')
    ->select(
        'cd.*',
        'dp.name as department_name',
        'ds.name as designation_name',
        'ct.name as complaintype_name',
        'sub.name as subject_name'
    )
    ->where('cd.complain_id', $id)
    ->get();
           

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

   public function getLokayuktUsers(){
     
        $usersByRole = User::with('role')
         ->whereNotNull('role_id')
        ->get()
        ->groupBy(fn ($user) => $user->role->name);
        

         if(!empty($usersByRole['lok-ayukt'])){

           return response()->json($usersByRole['lok-ayukt']);
        }else{

            return response()->json(["message"=>"Data Not Found"]);
        }
        // dd($usersByRole['lok-ayukt']);
   }
   public function getUpLokayuktUsers(){
    $usersByRole = User::with('role')
     ->whereNotNull('role_id')
        ->get()
        ->groupBy(fn ($user) => $user->role->name);
        if(!empty($usersByRole['up-lok-ayukt'])){

            return response()->json($usersByRole['up-lok-ayukt']);
        }else{

            return response()->json(["message"=>"Data Not Found"]);
        }
       
   }
   public function getDealingAssistantUsers(){
    // $usersBySubRole = User::with('role','subrole')
    //     ->get()
    //     ->groupBy(fn ($user) => $user->subrole->name);
    $usersBySubRole = User::with('role', 'subrole')
    ->whereNotNull('sub_role_id') // only users with subrole
    ->get()
    ->groupBy(fn ($user) => $user->subrole->name);
        // dd($usersBySubRole);
         if(!empty($usersBySubRole['dea-assis'])){

            return response()->json($usersBySubRole['dea-assis']);
        }else{

            return response()->json(["message"=>"Data Not Found"]);
        }
   }
    public function forwardComplaintbySO(Request $request,$complainId){
        //    dd($request->all());
        $user = Auth::user()->id;
        // dd($usersubrole);
   

        $validation = Validator::make($request->all(), [
            // 'forward_by_so_us' => 'required|exists:users,id',
            'forward_to_d_a' => 'required|exists:users,id',
            // 'remark' => 'required',
         
          
        ], [
            // 'forward_by_so_us.required' => 'Forward by Supervisor is required.',
            // 'forward_by_so_us.exists' => 'Forward by user does not exist.',
            'forward_to_d_a.required' => 'Forward to user is required.',
            'forward_to_d_a.exists' => 'Forward to user does not exist.',
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
                $cmpAction->forward_by_so_us = $user;
                $cmpAction->forward_to_d_a = $request->forward_to_d_a; //add supervisor user_id 
                $cmpAction->status_so_us = 1;
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

      public function forwardComplaintbyds_js(Request $request,$complainId){
        //    dd($request->all());
        $user = Auth::user()->id;
        // dd($usersubrole);
   

        $validation = Validator::make($request->all(), [
            // 'forward_by_ds_js' => 'required|exists:users,id',
            'forward_to_d_a' => 'required|exists:users,id',
            // 'remark' => 'required',
         
          
        ], [
            // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
            // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
            'forward_to_d_a.required' => 'Forward to user is required.',
            'forward_to_d_a.exists' => 'Forward to user does not exist.',
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
                $cmpAction->forward_by_ds_js = $user;
                $cmpAction->forward_to_d_a = $request->forward_to_d_a; //add supervisor user_id 
                $cmpAction->status_ds_js = 1;
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

        public function forwardReporttbyds_js(Request $request,$complainId){
        //    dd(Auth::user()->getUserByRoles);
 
        $userId = Auth::user()->id;
        // $usersubrole = Auth::user()->subrole->name;
        // dd($usersubrole);
        

        $validation = Validator::make($request->all(), [
            // 'forward_by_ds_js' => 'required|exists:users,id',
            'forward_to' => 'required|exists:users,id',
            // 'remark' => 'required',
         
          
        ], [
            // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
            // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
            'forward_to.required' => 'Forward to user is required.',
            'forward_to.exists' => 'Forward to user does not exist.',
            // 'remark.required' => 'Remark is required.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }
        if(isset($complainId) && $request->isMethod('post')){
            $user = User::with('role')->where('id',$request->forward_to)->get();
            // dd($user[0]->role->name);
            $roleFwd = $user[0]->role->name;
            // dd($roleFwd);
             $cmp =  Complaint::findOrFail($complainId);
             $cmpAct =  ComplaintAction::where('complaint_id',$complainId)->first();
    
            if($cmp){
                if($cmpAct){

                $cmpAct->complaint_id = $complainId;
                $cmpAct->forward_by_ds_js = $userId;
                if($roleFwd == "lok-ayukt"){
                    $cmpAct->forward_to_lokayukt = $request->forward_to;
                    $cmpAct->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAct->forward_to_uplokayukt = $request->forward_to;
                    $cmpAct->status_uplokayukt = 1;
                }
                // $cmpAct->forward_to = $request->forward_to; //add supervisor user_id 
                
                $cmpAct->action_type = "Forwarded";
                // $cmpAct->remarks = $request->remarks;
                $cmpAct->save();
                  return response()->json([
                    'status' => true,
                    'message' => 'Forwarded Update Successfully',
                    'data' => $cmp
                ], 200);
                }
                $cmpAction =new ComplaintAction();
                $cmpAction->complaint_id = $complainId;
                $cmpAction->forward_by_ds_js = $userId;
                if($roleFwd == "lok-ayukt"){
                    $cmpAction->forward_to_lokayukt = $request->forward_to;
                    $cmpAction->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAction->forward_to_uplokayukt = $request->forward_to;
                    $cmpAction->status_uplokayukt = 1;
                }
                // $cmpAction->forward_to = $request->forward_to; //add supervisor user_id 
                
                $cmpAction->action_type = "Forwarded";
                $cmpAction->remarks = $request->remarks;
                $cmpAction->save();
                  return response()->json([
                    'status' => true,
                    'message' => 'Forwarded Successfully',
                    'data' => $cmp
                ], 200);
            }
            // $cmp->forward_by = $request->forward_by;
            // $cmp->forward_to_d_a = $request->forward_to_d_a;
            // $cmp->sup_status = 1;
            // $cmp->save();
    
           
        }else{
            
             return response()->json([
                    'status' => false,
                    'message' => 'Please check Id'
                ], 401);
        }

    }

      public function allComplainspending(){
       
           $complainDetails = DB::table('complaints as cm')
                ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
                // ->leftJoin('departments as dp', 'cm.department_id', '=', 'dp.id')
                // ->leftJoin('designations as ds', 'cm.designation_id', '=', 'ds.id')
                // ->leftJoin('complaintype as ct', 'cm.complaintype_id', '=', 'ct.id')
                // ->leftJoin('subjects as sub', 'cm.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
                ->select(
                    'cm.*',
                    // 'dd.district_name',
                    // 'dp.name as department_name',
                    // 'ds.name as designation_name',
                    // 'ct.name as complaintype_name',
                    // 'sub.name as subject_name'
                )
                ->where('form_status',0)
                ->where('approved_rejected_by_ro',1)
                ->where('approved_rejected_by_so_us',0)
                ->get();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

     public function allComplainsapproved(){
       
           $complainDetails = DB::table('complaints as cm')
                ->leftJoin('district_master as dd', 'cm.district_id', '=', 'dd.district_code')
                // ->leftJoin('departments as dp', 'cm.department_id', '=', 'dp.id')
                // ->leftJoin('designations as ds', 'cm.designation_id', '=', 'ds.id')
                // ->leftJoin('complaintype as ct', 'cm.complaintype_id', '=', 'ct.id')
                // ->leftJoin('subjects as sub', 'cm.subject_id', '=', 'sub.id') // <-- should be subject_id, not department_id
                ->select(
                    'cm.*',
                    'dd.district_name',
                    // 'dp.name as department_name',
                    // 'ds.name as designation_name',
                    // 'ct.name as complaintype_name',
                    // 'sub.name as subject_name'
                )
                ->where('form_status',1)
                ->where('approved_rejected_by_ro',1)
                ->where('approved_rejected_by_so_us',1)
                ->get();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

}
