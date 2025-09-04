<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;
use DB;
use App\Models\Role;

class AdminReportController extends Controller
{
    //   public function complainReports()
    // {
    //     $user_id = Auth::id();
    //     if (empty($user_id)) {
    //         return redirect()->route('login')->with('error', 'Unauthorised Request.');
    //     }
    //     $role_id = 'all';
    //     // $districtId = $district_id = auth()->user()->district_id ? auth()->user()->district_id : '';
    //     //dd($roleid);
    //     $districtId = request()->query('district') ?? null;
    //     $tehsilId = request()->query('tehsil');
    //     $blockId = request()->query('block');
    //     $roleid = request()->query('des') ?? 'all';
    //     $status = request()->query('type') ?? 'all';
    //     $districtData = DB::table('district_master')->orderBy('dist_name')->get();
    //     $tahsils = DB::table('tehsil_master')
    //         ->select('tehsil_code', 'tehsil_name')
    //         ->orderBy('tehsil_name')
    //         ->get();
    //     $blocks = DB::table('block_master')
    //         ->select('block_code', 'block_name')
    //         ->orderBy('block_name')
    //         ->get();
    //     $records = DB::table('housing_details')
    //         ->leftJoin('district_master as dd', DB::raw("housing_details.district_id COLLATE utf8mb4_unicode_ci"), '=', DB::raw("dd.district_code COLLATE utf8mb4_unicode_ci"))
    //         ->leftJoin('tehsil_master as td', DB::raw("housing_details.tahsil_id COLLATE utf8mb4_unicode_ci"), '=', DB::raw("td.tehsil_code COLLATE utf8mb4_unicode_ci"))
    //         ->leftJoin('block_master as bd', 'housing_details.block_id', '=', 'bd.id')
    //         ->leftJoin('m_tbl_relieftype as rf', 'housing_details.relief_type', '=', 'rf.id')
    //          ->leftJoin('disastertype', 'housing_details.cause_of_death', '=', 'disastertype.Id')
    //         ->select(
    //             // 'housing_details.*',
    //             'housing_details.name as housing_details_name',
    //             'housing_details.application_no',
    //             'housing_details.application_status',
    //             'housing_details.id',
    //             'housing_details.name',
    //             'housing_details.address',
    //             'housing_details.cause_of_death',
    //             'housing_details.disaster_date',
    //             'housing_details.approved_rejected_by_ri',
    //             'housing_details.approved_rejected_by_naibtahsildar',
    //             'housing_details.approved_rejected_by_tahsildar',
    //             'housing_details.approved_rejected_by_sdm',
    //             'housing_details.approved_rejected_by_adm',
    //             'dd.dist_name as housing_details_district',
    //             'td.tehsil_name as housing_details_tehsil',
    //             'bd.block_name as housing_details_block',
    //             'rf.ReliefSubType as relief_type',
    //             'rf.damage_type as damage',
    //             'rf.house_type as house',
    //             'rf.PermissibleAmount as amount',
    //             'disastertype.DisasterType as cause',
    //             'disastertype.DisasterType_H as cause_h',
    //         );
    //     if (!empty($districtId)) {
    //         $records->where('housing_details.district_id', $districtId);
    //     }
    //     if ($tehsilId) {
    //         $records->where('housing_details.tahsil_id', $tehsilId);
    //     }
    //     if ($blockId) {
    //         $records->where('housing_details.block_id', $blockId);
    //     }
    //     if (!empty($roleid) && $roleid == '7') {
    //         $records->where('housing_details.approved_rejected_by_ri', $status);
    //         $records->where('housing_details.approved_rejected_by_naibtahsildar', 0);
    //         $records->where('housing_details.approved_rejected_by_tahsildar', 0);
    //         $records->where('housing_details.approved_rejected_by_sdm', 0);
    //         $records->where('housing_details.approved_rejected_by_adm', 0);
    //     }
    //     if (!empty($roleid) && $roleid == '8') {
    //         $records->where('housing_details.approved_rejected_by_ri', 1);
    //         $records->where('housing_details.approved_rejected_by_naibtahsildar', $status);
    //         $records->where('housing_details.approved_rejected_by_tahsildar', 0);
    //         $records->where('housing_details.approved_rejected_by_sdm', 0);
    //         $records->where('housing_details.approved_rejected_by_adm', 0);
    //     }
    //     if (!empty($roleid) && $roleid == '9') {
    //         $records->where('housing_details.approved_rejected_by_ri', 1);
    //         $records->where('housing_details.approved_rejected_by_naibtahsildar', 1);
    //         $records->where('housing_details.approved_rejected_by_tahsildar', $status);
    //         $records->where('housing_details.approved_rejected_by_sdm', 0);
    //         $records->where('housing_details.approved_rejected_by_adm', 0);
    //     }
    //     if (!empty($roleid) && $roleid == '10') {
    //         $records->where('housing_details.approved_rejected_by_ri', 1);
    //         $records->where('housing_details.approved_rejected_by_naibtahsildar', 1);
    //         $records->where('housing_details.approved_rejected_by_tahsildar', 1);
    //         $records->where('housing_details.approved_rejected_by_sdm', $status);
    //         $records->where('housing_details.approved_rejected_by_adm', 0);
    //     }
    //     if (!empty($roleid) && $roleid == '11') {
    //         $records->where('housing_details.approved_rejected_by_ri', 1);
    //         $records->where('housing_details.approved_rejected_by_naibtahsildar', 1);
    //         $records->where('housing_details.approved_rejected_by_tahsildar', 1);
    //         $records->where('housing_details.approved_rejected_by_sdm', 1);
    //         $records->where('housing_details.approved_rejected_by_adm', $status);
    //     }
    //     // dd($records->get());
    //     $records = $records->paginate(50);
    //     $roles = Role::whereNotIn('id', [5, 6])->get();
    //     // dd($roles);
    //     // dd($districtData);
    //     return view('admin.reports.admin_pendency_report', compact('districtId', 'status', 'roleid', 'records', 'districtData', 'blockId', 'tehsilId', 'districtId', 'roles', 'tahsils', 'blocks'));
    // }
}
