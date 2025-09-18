<?php

namespace App\Http\Controllers\api\Supervisor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SupervisorReportController extends Controller
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
        // $departments = DB::table('departments')
        //     ->select('name', 'name_hi')
        //     ->orderBy('name')
        //     ->get();
        // $designations = DB::table('designations')
        //    ->select('name', 'name_hi')
        //     ->orderBy('name')
        //     ->get();
        // $complaintypes = DB::table('complaintype')
        //      ->select('name', 'name_hi')
        //     ->orderBy('name')
        //     ->get();
        // $subjects = DB::table('subjects')
        //      ->select('name', 'name_hi')
        //     ->orderBy('name')
        //     ->get();
        // $records = DB::table('complaints')
        //     ->leftJoin('complaints_details as cd', 'complaints.id', '=', 'cd.complain_id')
        //     ->leftJoin('district_master as dd', DB::raw("complaints.district_id"), '=', DB::raw("dd.district_code"))
        //     ->leftJoin('departments as dp', DB::raw("cd.department_id"), '=', DB::raw("dp.id"))
        //     ->leftJoin('designations as ds', DB::raw("cd.designation_id"), '=', DB::raw("ds.id"))
        //     ->leftJoin('complaintype as ct', DB::raw("cd.complaintype_id"), '=', DB::raw("ct.id"))
        //     ->leftJoin('subjects as sub', DB::raw("cd.department_id"), '=', DB::raw("sub.id"))
            
        //     ->select(
        //         'complaints.*',
        //         'dd.district_name as district_name',
        //         'dp.name as department_name',
        //         'ds.name as designation_name',
        //         'ct.name as complaintype_name',
        //         'sub.name as subject_name',
        //     );
//         $records = DB::table('complaints')
//     ->leftJoin('district_master as dd', 'complaints.district_id', '=', 'dd.district_code')
//     ->select(
//         'complaints.*',
//         'dd.district_name as district_name'
//     )
//     // ->where('complaints.id', $id)
//     ->first();

//    $records->details = DB::table('complaints_details as cd')
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
        'dd.district_code'
    )
    ->where('approved_rejected_by_ro', 1)
        ->get();
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
                // 'dd.district_name as district_name',
                // 'dp.name as department_name',
                // 'ds.name as designation_name',
                // 'ct.name as complaintype_name',
                // 'sub.name as subject_name',
            )
            // ->groupBy('complaints.id','u.id','srole.name')
            ->where('approved_rejected_by_ro', 1)
            ->get();
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

}
