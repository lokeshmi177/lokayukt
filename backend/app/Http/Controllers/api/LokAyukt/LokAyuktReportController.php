<?php

namespace App\Http\Controllers\api\LokAyukt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Complaint;
use App\Models\ComplaintAction;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class LokAyuktReportController extends Controller
{
      public function complainReports()
    {

        // $user_id = Auth::id();
        // if (empty($user_id)) {
        //    return response()->json([
        //         'status' => false,
        //         'errors' => 'User id not found'
        //     ], 422);
        // }

      
        $role_id = 'all';
        // $districtId = $district_id = auth()->user()->district_id ? auth()->user()->district_id : '';
        //dd($roleid);
        $districtId = request()->query('district') ?? null;
        $search = request()->query('search') ?? null;
        // $complaintype = request()->query('complaintype') ?? null;
        // $department = request()->query('department') ?? null;
        // $subject = request()->query('subject') ?? null;
        // $designation = request()->query('designation') ?? null;
        $roleid = request()->query('des') ?? 'all';
        $status = request()->query('status') ?? '';
       
        $districtData = DB::table('district_master')->orderBy('district_name')->get();
                   $userSubrole = Auth::user()->subrole->name; 
         if($userSubrole){
                        $records = DB::table('complaints')
                ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')
                ->leftJoin('district_master as dd', 'complaints.district_id', '=', 'dd.district_code')
                ->leftJoin('departments as dp', 'cd.department_id', '=', 'dp.id')
                ->leftJoin('designations as ds', 'cd.designation_id', '=', 'ds.id')
                ->leftJoin('complaintype as ct', 'cd.complaintype_id', '=', 'ct.id')
                ->leftJoin('subjects as sub', 'cd.subject_id', '=', 'sub.id')
                ->select(
                    'complaints.id',
                    'complaints.complain_no',
                    'complaints.name',
                    'complaints.status',
                    'complaints.created_at',
                    'dd.district_name as district_name',
                    'dd.district_code as district_id',
                    'ds.name as designation_name',

                    // Concatenate multiple related fields
                    DB::raw("GROUP_CONCAT(DISTINCT dp.name SEPARATOR ', ') as department_name"),
                    DB::raw("GROUP_CONCAT(DISTINCT ds.name SEPARATOR ', ') as designation_name"),
                    DB::raw("GROUP_CONCAT(DISTINCT ct.name SEPARATOR ', ') as complaintype_name"),
                    DB::raw("GROUP_CONCAT(DISTINCT sub.name SEPARATOR ', ') as subject_name")
                );
                    if (!empty($districtId)) {
                        $records->where('complaints.district_id', $districtId);
                    }

            
                    if (!empty($status)) {
                
                        $records->where('complaints.status', $status);
                    }
                    
                    if (!empty($search)) {
                        $records->where(function ($q) use ($search) {
                            $q->where('complaints.application_no', 'like', "%{$search}%")
                            ->orWhere('complaints.name', 'like', "%{$search}%")
                            ->orWhere('complaints.mobile', 'like', "%{$search}%");
                        });
                    }
                      switch ($userSubrole) {
                        case "so-us":
                              $records->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                  ->where('approved_rejected_by_ds_js', 0);
                    //         $records->where('form_status', 1)
                    // ->where('approved_rejected_by_ro', 1)
                    // ->where('approved_rejected_by_so_us', 0);
                    // ->whereNot('approved_rejected_by_ds_js', 1);
                                // ->where('approved_rejected_by_ro', 1);
                                //   ->where('approved_by_ro', 1);
                            // $records->where('complaints.added_by', $user);
                            break;

                        case "ds-js":
                        $records->where('form_status', 1)
                                // ->where('approved_rejected_by_ro', 1)
                                ->whereOr('approved_rejected_by_so', 1);
                                //   ->where('forward_so', 1)
                                //   ->whereOr('forward_to_uplokayukt', 1);
                            break;

                        case "sec":
                        $records->where('form_status', 1)
                                // ->where('approved_rejected_by_ro', 1)
                                ->where('forward_to_lokayukt', 1)
                                ->whereOr('forward_to_uplokayukt', 1);
                            break;

                        case "cio-io":
                        $records->where('form_status', 1)
                                // ->where('approved_rejected_by_ro', 1)
                                ->where('forward_to_lokayukt', 1)
                                ->whereOr('forward_to_uplokayukt', 1);
                            break;

                        case "dea-assis":
                        $records->where('form_status', 1)
                  ->where('approved_rejected_by_ro', 1)
                   ->where('approved_rejected_by_so_us', 1)
                    ->orWhere('approved_rejected_by_ds_js', 1)
                    ->whereNotNull('forward_to_d_a');
                            break;

                        default:
                            return response()->json([
                                'status' => false,
                                'message' => 'Invalid subrole',
                                'data' => [],
                            ], 400);
                    }

                    // if ($departments) {
                    //     $records->where('complaints.department_id', $department);
                    // }
                    // if ($designations) {
                    //     $records->where('complaints.designation_id', $designation);
                    // }
                    // if ($complaintypes) {
                    //     $records->where('complaints.complaintype_id', $complaintype);
                    // }
                    // if ($subjects) {
                    //     $records->where('complaints.subject_id', $subject);
                    // }
                    // if (!empty($roleid) && $roleid == '7') {
                    //     $records->where('complaints.approved_rejected_by_ri', $status);
                    //     $records->where('complaints.approved_rejected_by_naibtahsildar', 0);
                    //     $records->where('complaints.approved_rejected_by_tahsildar', 0);
                    //     $records->where('complaints.approved_rejected_by_sdm', 0);
                    //     $records->where('complaints.approved_rejected_by_adm', 0);
                    // }
                    // if (!empty($roleid) && $roleid == '8') {
                    //     $records->where('complaints.approved_rejected_by_ri', 1);
                    //     $records->where('complaints.approved_rejected_by_naibtahsildar', $status);
                    //     $records->where('complaints.approved_rejected_by_tahsildar', 0);
                    //     $records->where('complaints.approved_rejected_by_sdm', 0);
                    //     $records->where('complaints.approved_rejected_by_adm', 0);
                    // }
                    // if (!empty($roleid) && $roleid == '9') {
                    //     $records->where('complaints.approved_rejected_by_ri', 1);
                    //     $records->where('complaints.approved_rejected_by_naibtahsildar', 1);
                    //     $records->where('complaints.approved_rejected_by_tahsildar', $status);
                    //     $records->where('complaints.approved_rejected_by_sdm', 0);
                    //     $records->where('complaints.approved_rejected_by_adm', 0);
                    // }
                    // if (!empty($roleid) && $roleid == '10') {
                    //     $records->where('complaints.approved_rejected_by_ri', 1);
                    //     $records->where('complaints.approved_rejected_by_naibtahsildar', 1);
                    //     $records->where('complaints.approved_rejected_by_tahsildar', 1);
                    //     $records->where('complaints.approved_rejected_by_sdm', $status);
                    //     $records->where('complaints.approved_rejected_by_adm', 0);
                    // }
                    // if (!empty($roleid) && $roleid == '11') {
                    //     $records->where('complaints.approved_rejected_by_ri', 1);
                    //     $records->where('complaints.approved_rejected_by_naibtahsildar', 1);
                    //     $records->where('complaints.approved_rejected_by_tahsildar', 1);
                    //     $records->where('complaints.approved_rejected_by_sdm', 1);
                    //     $records->where('complaints.approved_rejected_by_adm', $status);
                    // }
                    // dd($records->toSql());
                    $records = $records
                    ->groupBy(
                    'complaints.id',
                    'complaints.name',
                    'dd.district_name',
                    'complaints.complain_no',
                    'complaints.created_at',
                    'complaints.status',
                    'dd.district_code',
                    'ds.name',
                )
                ->where('approved_rejected_by_ro', 1)
                        // ->toSql();
                    ->get();
        }
 
        // return json_encode($records->toSql());
        // $records = $records->paginate(50);
        // $roles = Role::whereNotIn('id', [5, 6])->get();
        // dd($roles);
        // dd($districtData);
        if($records){
            
            return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $records,
               'subrole' => $userSubrole
           ]);
        }else{
            return response()->json([
               'status' => false,
               'message' => 'No Records Found',
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
    
    public function progress_report(){
        $user  = Auth::user()->name;
        $userSubroleRole = Auth::user()->subrole->name;
        
         $records = DB::table('complaints')
            // ->leftJoin('district_master as dd', DB::raw("complaints.district_id"), '=', DB::raw("dd.district_code"))
            // ->leftJoin('departments as dp', DB::raw("complaints.department_id"), '=', DB::raw("dp.id"))
            // ->leftJoin('designations as ds', DB::raw("complaints.designation_id"), '=', DB::raw("ds.id"))
            // ->leftJoin('complaintype as ct', DB::raw("complaints.complaintype_id"), '=', DB::raw("ct.id"))
            // ->leftJoin('subjects as sub', DB::raw("complaints.department_id"), '=', DB::raw("sub.id"))
            ->leftJoin('users as u', DB::raw("complaints.added_by"), '=', DB::raw("u.id"))
            ->leftJoin('sub_roles as srole', DB::raw("u.sub_role_id"), '=', DB::raw("srole.id"))
            ->join('complaint_actions as ca', DB::raw("complaints.id"), '=', DB::raw("ca.complaint_id"))
            
            ->select(
                'complaints.*',
                'ca.*',
                'u.id as user_id',
                'u.name as user_name',
                'srole.name as subrole_name',
                // 'subrole_name.'-'.user_name as assigned_to'
                // 'ca.*',
                // 'dd.district_name as district_name',
                // 'dp.name as department_name',
                // 'ds.name as designation_name',
                // 'ct.name as complaintype_name',
                // 'sub.name as subject_name',
            )
            // ->groupBy('complaints.id','u.id','srole.name')
            ->where('approved_rejected_by_ro', 1)
            ->where('approved_rejected_by_ds_js', 0)
            ->get();
            // CIO - राज कुमार
            //  $records->assigned_to = $records->subrole_name.'-'.$records->user_name;
                                                                                
            
              return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' => $records,
            ]);
            // dd($records);
    }
    

     public function current_report(){
        // $userSubroleRole = Auth::user()->subrole->name;
        
         $records = DB::table('complaints')
            // ->leftJoin('district_master as dd', DB::raw("complaints.district_id"), '=', DB::raw("dd.district_code"))
            // ->leftJoin('departments as dp', DB::raw("complaints.department_id"), '=', DB::raw("dp.id"))
            // ->leftJoin('designations as ds', DB::raw("complaints.designation_id"), '=', DB::raw("ds.id"))
            // ->leftJoin('complaintype as ct', DB::raw("complaints.complaintype_id"), '=', DB::raw("ct.id"))
            // ->leftJoin('subjects as sub', DB::raw("complaints.department_id"), '=', DB::raw("sub.id"))
            ->leftJoin('users as u', DB::raw("complaints.added_by"), '=', DB::raw("u.id"))
            ->leftJoin('sub_roles as srole', DB::raw("u.sub_role_id"), '=', DB::raw("srole.id"))
            ->leftJoin('complaint_actions as ca', DB::raw("complaints.id"), '=', DB::raw("ca.complaint_id"))
            
            ->select(
                'complaints.*',
                'u.id as user_id',
                'srole.name as subrole_name',
                'ca.*',
                DB::raw('DATEDIFF(NOW(), ca.target_date) as days')
                // 'dd.district_name as district_name',
                // 'dp.name as department_name',
                // 'ds.name as designation_name',
                // 'ct.name as complaintype_name',
                // 'sub.name as subject_name',
            )
            // ->groupBy('complaints.id','u.id','srole.name')
            ->where('approved_rejected_by_ro', 1)
            ->get();
            //    dd($records);
              return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' => $records,
            ]);
         
    }

    public function analytics(){
        $stats = DB::table('complaints')
    ->leftJoin('complaint_actions as ca', 'complaints.id', '=', 'ca.complaint_id')
    ->selectRaw('
        AVG(DATEDIFF(IFNULL(ca.created_at, NOW()), complaints.created_at)) as avg_processing_time,
        SUM(CASE WHEN complaints.form_status = "1" THEN 1 ELSE 0 END) as files_in_transit,
        SUM(CASE WHEN ca.target_date < NOW()  THEN 1 ELSE 0 END) as overdue_files
    ')
    ->where('approved_rejected_by_ro', 1)
    ->first();
              return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' =>  $stats,
            ]);
    }
    
    
    public function forwardReporttbySo(Request $request,$complainId){
        //    dd(Auth::user()->getUserByRoles);
 
        $userId = Auth::user()->id;
        // $usersubrole = Auth::user()->subrole->name;
        // dd($usersubrole);
        

        $validation = Validator::make($request->all(), [
            // 'forward_by_ds_js' => 'required|exists:users,id',
            'forward_to' => 'required|exists:users,id',
            'remark' => 'required',
         
          
        ], [
            // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
            // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
            'forward_to.required' => 'Forward to user is required.',
            'forward_to.exists' => 'Forward to user does not exist.',
            'remark.required' => 'Remark is required.',
           
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
                 $cmp->report_status = "Forwarded";
                 $cmp->save();
                if($cmpAct){

                $cmpAct->complaint_id = $complainId;
                $cmpAct->forward_by_so_us = $userId;
                // $cmpAct->report_status = "Forwarded";
                if($roleFwd == "lok-ayukt"){
                    $cmpAct->forward_to_lokayukt = $request->forward_to;
                    $cmpAct->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAct->forward_to_uplokayukt = $request->forward_to;
                    $cmpAct->status_uplokayukt = 1;
                }
                // $cmpAct->forward_to = $request->forward_to; //add supervisor user_id 
                
                //
                $remark ='Remark By Section Officer / Under Secretary';
                $remark.='\n';
                $remark.= $request->remark;
                $remark.='\n';
                $cmpAct->remarks = $remark;
                $cmpAct->save();
                  return response()->json([
                    'status' => true,
                    'message' => 'Forwarded Update Successfully',
                    'data' => $cmp
                ], 200);
                }
                $cmpAction =new ComplaintAction();
                $cmpAction->complaint_id = $complainId;
                $cmpAction->forward_by_so_us = $userId;
                if($roleFwd == "lok-ayukt"){
                    $cmpAction->forward_to_lokayukt = $request->forward_to;
                    $cmpAction->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAction->forward_to_uplokayukt = $request->forward_to;
                    $cmpAction->status_uplokayukt = 1;
                }
                // $cmpAction->forward_to = $request->forward_to; //add supervisor user_id 
                
                // $cmpAction->action_type = "Forwarded";
                $remark ='Remark By Section Officer / Under Secretary';
                $remark.='\n';
                $remark.= $request->remark;
                $remark.='\n';
                $cmpAction->remarks = $remark;
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
    public function forwardReporttbyds(Request $request,$complainId){
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
                  $cmp->report_status = "Forwarded";
                 $cmp->save();
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
                
                $remark ='Remark By Deputy Secretary / Joint Secretary';
                $remark.='\n';
                $remark.= $request->remark;
                $remark.='\n';
                $cmpAct->remarks = $remark;
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
                
                $remark ='Remark By Deputy Secretary / Joint Secretary';
                $remark.='\n';
                $remark.= $request->remark;
                $remark.='\n';
                $cmpAction->remarks = $remark;
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

     public function forwardReporttbysec(Request $request,$complainId){
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
                  $cmp->report_status = "Forwarded";
                 $cmp->save();
                if($cmpAct){

                $cmpAct->complaint_id = $complainId;
                $cmpAct->forward_by_sec = $userId;
                if($roleFwd == "lok-ayukt"){
                    $cmpAct->forward_to_lokayukt = $request->forward_to;
                    $cmpAct->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAct->forward_to_uplokayukt = $request->forward_to;
                    $cmpAct->status_uplokayukt = 1;
                }
                // $cmpAct->forward_to = $request->forward_to; //add supervisor user_id 
                
               
               $remark ='Remark By Secretary';
                $remark.='\n';
                $remark.= $request->remark;
                $remark.='\n';
                $cmpAct->remarks = $remark;
                $cmpAct->save();
                  return response()->json([
                    'status' => true,
                    'message' => 'Forwarded Update Successfully',
                    'data' => $cmp
                ], 200);
                }
                $cmpAction =new ComplaintAction();
                $cmpAction->complaint_id = $complainId;
                $cmpAction->forward_by_sec = $userId;
                if($roleFwd == "lok-ayukt"){
                    $cmpAction->forward_to_lokayukt = $request->forward_to;
                    $cmpAction->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAction->forward_to_uplokayukt = $request->forward_to;
                    $cmpAction->status_uplokayukt = 1;
                }
                // $cmpAction->forward_to = $request->forward_to; //add supervisor user_id 
                
                $cmpAction->action_type = "Forwarded";
               $remark ='Remark By Secretary';
                $remark.='\n';
                $remark.= $request->remark;
                $remark.='\n';
                $cmpAction->remarks = $remark;
                $cmpAction->save();
                  return response()->json([
                    'status' => true,
                    'message' => 'Forwarded Successfully',
                    'data' => $cmp
                ], 200);
            }    
           
        }else{
            
             return response()->json([
                    'status' => false,
                    'message' => 'Please check Id'
                ], 401);
        }

    }

    public function forwardReporttbycio(Request $request,$complainId){
        
        $userId = Auth::user()->id;
 

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
                  $cmp->report_status = "Forwarded";
                 $cmp->save();
                if($cmpAct){

                $cmpAct->complaint_id = $complainId;
                $cmpAct->forward_by_cio_io = $userId;
                if($roleFwd == "lok-ayukt"){
                    $cmpAct->forward_to_lokayukt = $request->forward_to;
                    $cmpAct->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAct->forward_to_uplokayukt = $request->forward_to;
                    $cmpAct->status_uplokayukt = 1;
                }
                // $cmpAct->forward_to = $request->forward_to; //add supervisor user_id 
                
               
                $remark ='Remark By CIO / Investigation Officer';
                $remark.='\n';
                $remark.= $request->remark;
                $remark.='\n';
                $cmpAct->remarks = $remark;
                $cmpAct->save();
                  return response()->json([
                    'status' => true,
                    'message' => 'Forwarded Update Successfully',
                    'data' => $cmp
                ], 200);
                }
                $cmpAction =new ComplaintAction();
                $cmpAction->complaint_id = $complainId;
                $cmpAction->forward_by_cio_io = $userId;
                if($roleFwd == "lok-ayukt"){
                    $cmpAction->forward_to_lokayukt = $request->forward_to;
                    $cmpAction->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAction->forward_to_uplokayukt = $request->forward_to;
                    $cmpAction->status_uplokayukt = 1;
                }
                // $cmpAction->forward_to = $request->forward_to; //add supervisor user_id 
                
                $cmpAction->action_type = "Forwarded";
                $remark ='Remark By CIO / Investigation Officer';
                $remark.='\n';
                $remark.= $request->remark;
                $remark.='\n';
                $cmpAction->remarks = $remark;
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

     public function forwardReporttbyda(Request $request,$complainId){
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
                  $cmp->report_status = "Forwarded";
                 $cmp->save();
                if($cmpAct){

                $cmpAct->complaint_id = $complainId;
                $cmpAct->forward_by_d_a = $userId;
                if($roleFwd == "lok-ayukt"){
                    $cmpAct->forward_to_lokayukt = $request->forward_to;
                    $cmpAct->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAct->forward_to_uplokayukt = $request->forward_to;
                    $cmpAct->status_uplokayukt = 1;
                }
                // $cmpAct->forward_to = $request->forward_to; //add supervisor user_id 
                
               
                $remark ='Remark By Dealing Assistant';
                $remark.='\n';
                $remark.= $request->remark;
                $remark.='\n';
                $cmpAct->remarks = $remark;
                $cmpAct->save();
                  return response()->json([
                    'status' => true,
                    'message' => 'Forwarded Update Successfully',
                    'data' => $cmp
                ], 200);
                }
                $cmpAction =new ComplaintAction();
                $cmpAction->complaint_id = $complainId;
                $cmpAction->forward_by_d_a = $userId;   
                if($roleFwd == "lok-ayukt"){
                    $cmpAction->forward_to_lokayukt = $request->forward_to;
                    $cmpAction->status_lokayukt = 1;
                }elseif($roleFwd =="up-lok-ayukt"){
                    $cmpAction->forward_to_uplokayukt = $request->forward_to;
                    $cmpAction->status_uplokayukt = 1;
                }
                // $cmpAction->forward_to = $request->forward_to; //add supervisor user_id 
                
       
                $remark ='Remark By Dealing Assistant';
                $remark.='\n';
                $remark.= $request->remark;
                $remark.='\n';
                $cmpAction->remarks = $remark;
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

        public function allComplains(){

        //    $query = DB::table('complaints');
        //   $complainDetails = $query->count();
        // dd($deadpersondetails);

       $complainDetails =  DB::table('complaints as cm')
                ->select(
                    DB::raw('COUNT(cm.id) as total_complaints'),
                    DB::raw("SUM(CASE WHEN cm.approved_rejected_by_ro = '1' AND cm.approved_rejected_by_so_us = '1'  THEN 1 ELSE 0 END) as total_approved"),
                    DB::raw("SUM(CASE WHEN cm.approved_rejected_by_ro = '1' AND cm.approved_rejected_by_so_us = '0' THEN 1 ELSE 0 END) as total_pending"),
                    DB::raw("SUM(CASE WHEN cm.status = 'Rejected' THEN 1 ELSE 0 END) as total_rejected")
                )
                ->where('cm.approved_rejected_by_ro', '1')
                ->where('cm.approved_rejected_by_ds_js', '0')
                 ->where('in_draft','0')
                ->first();
            
           

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

        public function complainDistrictWise()
    {
       
        $complainCounts = Complaint::select('district_master.district_name', DB::raw('count(*) as complain_count'))
            ->join('district_master', 'complaints.district_id', '=', 'district_master.district_code')
            ->groupBy('district_master.district_code', 'district_master.district_name')
             ->where('approved_rejected_by_ro', '1')
                ->where('approved_rejected_by_ds_js', '0')
            // ->where('approved_rejected_by_ds_js', '0')
            // ->where('approved_rejected_by_d_a', '0')
            ->where('in_draft','0')
            ->limit(5)
            //  ->having('complain_count', '>', 0)
            ->pluck('complain_count', 'district_master.district_name');
       return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainCounts,
           ]);
    }

      public function complainDepartmentWise()
    {
       
        $complainCounts = Complaint::select('departments.name', DB::raw('count(*) as complain_count'))
        ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')    
        ->leftJoin('departments', 'cd.department_id', '=', 'departments.id')
            ->groupBy('departments.id', 'departments.name','department_id')
             ->where('approved_rejected_by_ro', '1')
                ->where('approved_rejected_by_ds_js', '0')
            ->where('in_draft','0')  
            ->pluck('complain_count', 'departments.name');
       return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainCounts,
           ]);
    }


        public function getMontlyTrends(){
        // $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // for ($j = 1; $j <= 12; $j++) {      
        // $months[] = date('M', mktime(0, 0, 0, $j, 10));
        // }
         $complaintData = DB::table('complaints as cm')
    ->select(
    
        DB::raw('MONTH(created_at) as month, COUNT(*) as count'),
        DB::raw('COUNT(cm.id) as total_complaints'),
        DB::raw("SUM(CASE WHEN cm.approved_rejected_by_ro = '1' AND cm.approved_rejected_by_so_us = '1' THEN 1 ELSE 0 END) as total_approved"),
        DB::raw("SUM(CASE WHEN cm.approved_rejected_by_ro = '1' AND cm.approved_rejected_by_so_us = '0' THEN 1 ELSE 0 END) as total_pending")
    )
  
    ->groupBy('month')
    // ->having('total_applications', '>', 0)
    ->orderBy('cm.name')
    ->limit(10)
     ->where('approved_rejected_by_ro', '1')
    ->where('approved_rejected_by_ds_js', '0')
     ->where('in_draft','0')
    ->get();
    $complaintData = $complaintData->map(function ($item) {
        if($item->total_complaints){
   return [
                'month' => date('F', mktime(0, 0, 0, $item->month, 10)),
                'year' => now()->year,
                // 'total_complaints' => $item->total_complaints,
                'approved' => $item->total_approved,
                'pending' => $item->total_pending,
            ];
        }
         
        })->toArray();

           return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' =>  $complaintData,
        ]);

    }

     public function complainComplaintypeWise()
    {
       
    //     $complainCounts = Complaint::select('complaintype.name', DB::raw('count(*) as complain_count'))
    //         ->join('complaintype', 'complaints.complaintype_id', '=', 'complaintype.id')
    //         ->groupBy('complaintype.id', 'complaintype.name')
             
    //         ->pluck('complain_count', 'complaintype.name');
    //    return response()->json([
    //            'status' => true,
    //            'message' => 'Records Fetch successfully',
    //            'data' => $complainCounts,
    //        ]);

        $complaintData = DB::table('complaints as cm')
        ->leftJoin('complaints_details as cd', 'cm.id', '=', 'cd.complain_id')
         ->leftjoin('complaintype', 'cd.complaintype_id', '=', 'complaintype.id')
    ->select(
    
        'complaintype.name',
        //  DB::raw('count(*) as complain_count'),
        //  DB::raw('count(cm.id) as total_count'),
          DB::raw('ROUND(AVG(DATEDIFF(NOW(), cd.created_at)), 1) as avg_days')
         
        // DB::raw("SUM(CASE WHEN cm.status = 'Disposed - Accepted' THEN 1 ELSE 0 END) as total_approved"),
        // DB::raw("SUM(CASE WHEN cm.status = 'In Progress' THEN 1 ELSE 0 END) as total_pending")
    )
  
    ->groupBy('complaintype.id', 'complaintype.name')
    // ->having('total_applications', '>', 0)
    // ->orderBy('cm.name')
     ->where('approved_rejected_by_ro', '1')
    ->where('approved_rejected_by_ds_js', '0')
     ->where('in_draft','0')
    ->limit(10)
    ->get();
//     $complaintData = $complaintData->map(function ($item) {
//         if($item->total_complaints){
//    return [
//                 'month' => date('F', mktime(0, 0, 0, $item->month, 10)),
//                 'year' => now()->year,
//                 // 'total_complaints' => $item->total_complaints,
//                 'approved' => $item->total_approved,
//                 'pending' => $item->total_pending,
//             ];
//         }
         
//         })->toArray();   

           return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' =>  $complaintData,
        ]);
    }

    public function complianceReport(){
         $complainDetails = DB::table('complaints as cm')
    ->select(
        DB::raw('COUNT(cm.id) as total_complaints'),

        // Counts
        // DB::raw("SUM(CASE WHEN cm.status = 'Disposed - Accepted' THEN 1 ELSE 0 END) as total_approved"),
        // DB::raw("SUM(CASE WHEN cm.status = 'In Progress' THEN 1 ELSE 0 END) as total_pending"),
        // DB::raw("SUM(CASE WHEN cm.status = 'Rejected' THEN 1 ELSE 0 END) as total_rejected"),

        // Percentages
        // DB::raw("ROUND(
        //     (SUM(CASE WHEN cm.approved_rejected_by_ro = '1' AND cm.approved_rejected_by_so_us = '1' THEN 1 ELSE 0 END) / 
        //      COUNT(cm.id)) * 100, 2
        // ) as approved_percentage"),

        // DB::raw("ROUND(
        //     (SUM(CASE WHEN cm.approved_rejected_by_ro = '1' AND cm.approved_rejected_by_so_us = '0' THEN 1 ELSE 0 END) / 
        //      COUNT(cm.id)) * 100, 2
        // ) as pending_percentage"),

        // DB::raw("ROUND(
        //     (SUM(CASE WHEN cm.status = 'Rejected' THEN 1 ELSE 0 END) / 
        //      COUNT(cm.id)) * 100, 2
        // ) as rejected_percentage")
          DB::raw("
            ROUND((SUM(CASE WHEN DATEDIFF(NOW(), cm.created_at) BETWEEN 1 AND 10 THEN 1 ELSE 0 END) / COUNT(cm.id)) * 100, 2) as approved_percentage
        "),
           DB::raw("
            ROUND((SUM(CASE WHEN DATEDIFF(NOW(), cm.created_at) BETWEEN 10 AND 20 THEN 1 ELSE 0 END) / COUNT(cm.id)) * 100, 2) as pending_percentage
        "),
        DB::raw("
            ROUND((SUM(CASE WHEN DATEDIFF(NOW(), cm.created_at) > 20 THEN 1 ELSE 0 END) / COUNT(cm.id)) * 100, 2) as rejected_percentage
        ")
    )
     ->where('in_draft','0')
           ->where('approved_rejected_by_ro', '1')
    ->where('approved_rejected_by_ds_js', '0')
    ->first();
    return response()->json([
        'status' => true,
        'message' => 'Records Fetch successfully',
        'data' => $complainDetails,
    ]);

    }
}
