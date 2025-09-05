<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;

class AdminReportController extends Controller
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
        $records = DB::table('complaints')
            ->leftJoin('district_master as dd', DB::raw("complaints.district_id"), '=', DB::raw("dd.district_code"))
            ->leftJoin('departments as dp', DB::raw("complaints.department_id"), '=', DB::raw("dp.id"))
            ->leftJoin('designations as ds', DB::raw("complaints.designation_id"), '=', DB::raw("ds.id"))
            ->leftJoin('complaintype as ct', DB::raw("complaints.complaintype_id"), '=', DB::raw("ct.id"))
            ->leftJoin('subjects as sub', DB::raw("complaints.department_id"), '=', DB::raw("sub.id"))
            
            ->select(
                'complaints.*',
                'dd.district_name as district_name',
                'dp.name as department_name',
                'ds.name as designation_name',
                'ct.name as complaintype_name',
                'sub.name as subject_name',
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
        $records = $records->get();
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

       public function allComplains(){

           $query = DB::table('complaints');
          $complainDetails = $query->get();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

     public function allComplainsPending(){
       
           $query = DB::table('complaints')
           ->where('status','In Progress');
          $complainDetails = $query->get();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

     public function allComplainsApproved(){
               $query = DB::table('complaints')
           ->where('status','Disposed - Accepted');
          $complainDetails = $query->get();
        // dd($deadpersondetails);

          return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainDetails,
           ]);
    }

     public function allComplainsRejected(){
              $query = DB::table('complaints')
           ->where('status','Rejected');
          $complainDetails = $query->get();
        // dd($deadpersondetails);

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
            ->join('departments', 'complaints.department_id', '=', 'departments.id')
            ->groupBy('departments.id', 'departments.name')
             
            ->pluck('complain_count', 'departments.name');
       return response()->json([
               'status' => true,
               'message' => 'Records Fetch successfully',
               'data' => $complainCounts,
           ]);
    }

}
