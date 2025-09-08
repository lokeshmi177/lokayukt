<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
       public function index()
    {
        //  $user_district_code = Auth::user()->district_id ?? null;
        // $addedBy = Auth::user()->id ?? null;
        $year = now()->year;

        $query = DB::table('complaints as cmp')
            // ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
            // ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
            // ->where('cmp.approved_rejected_by_ri', 1)
            // ->whereIn('cmp.approved_rejected_by_naibtahsildar', [0, 1, 2])
            // ->where('cmp.status', 2)
            // ->where('cmp.district_id', $user_district_code)
            ->orderByDesc('cmp.id');
         $totalcomplains = $query->count();

         
        $queryDay = DB::table('complaints as cmp')
            // ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
            // ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
            ->select('cmp.*')
            ->where('cmp.status', 'In Progress')
           ->whereDate('cmp.created_at', now()->toDateString()) // ✅ only today
            ->groupBy(DB::raw('DATE(cmp.created_at)'))
            // ->whereIn('cmp.approved_rejected_by_naibtahsildar', [0, 1, 2])
            // ->where('cmp.status', 2)
            // ->where('cmp.district_id', $user_district_code)
            ->orderByDesc('cmp.id');
         $todaycomplains = $queryDay->count();

         $query1 = DB::table('complaints as cmp')
            // ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
            ->select(DB::raw('COUNT(cmp.id) as total_complains'),DB::raw('AVG(DATEDIFF(now(), created_at)) as avg_days'))
            // ->where('cmp.approved_rejected_by_ri', 1)
            // ->whereIn('cmp.approved_rejected_by_naibtahsildar', [0, 1, 2])
            // ->where('cmp.status', 2)
            // ->where('cmp.district_id', $user_district_code)
            ->where('status','In Progress')
            ->groupBy(groups: 'cmp.status')
            ->orderByDesc('cmp.id');
         $pendingcomplains = $query1->get();

           $query2 = DB::table('complaints as cmp')
            // ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
            // ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
            // ->where('cmp.approved_rejected_by_ri', 1)
            // ->whereIn('cmp.approved_rejected_by_naibtahsildar', [0, 1, 2])
            // ->where('cmp.status', 2)
            // ->where('cmp.district_id', $user_district_code)
            ->where('status','Disposed - Accepted')
            ->orderByDesc('cmp.id');
         $approvedcomplains = $query2->count();

        $query3 = DB::table('complaints as cmp')
                    // ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
                    // ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
                    // ->where('cmp.approved_rejected_by_ri', 1)
                    // ->whereIn('cmp.approved_rejected_by_naibtahsildar', [0, 1, 2])
                    // ->where('cmp.status', 2)
                    // ->where('cmp.district_id', $user_district_code)
                    ->where('status','Rejected')
                    ->orderByDesc('cmp.id');
                $underinvestigationcomplains = $query3->count();

                    $query4 = DB::table('complaints as cmp')
                    // ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
                    // ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
                    // ->where('cmp.approved_rejected_by_ri', 1)
                    // ->whereIn('cmp.approved_rejected_by_naibtahsildar', [0, 1, 2])
                    // ->where('cmp.status', 2)
                    // ->where('cmp.district_id', $user_district_code)
                    ->where('status','Under Investigation')
                    ->orderByDesc('cmp.id');
                $rejectedcomplains = $query4->count();

         
        $dataDashboard = array($totalcomplains,$pendingcomplains,$approvedcomplains,$rejectedcomplains,$todaycomplains,$underinvestigationcomplains);
        
        
        // $totalhousing_benificiary_detail = DB::table('housing_benificiary_detail as hbd')
        //     ->join('complaints as hd', 'hbd.h_id', '=', 'hd.id')
        //     ->select(
        //         'hbd.*',
        //     )
        //     ->where('hd.district_id', $user_district_code) // optional filter
        //     ->count();

        // pending
        // $mutable = Carbon::now();
    //     $averagePendingDaysLekhpal = DB::table('complaints as cmp')
    //         // ->where('cmp.status', 2)
    //         ->where('status', 'In Progress')
    //         ->select(DB::raw('AVG(DATEDIFF(NOW(), cmp.created_at)) as avg_days'))
    //         ->value('avg_days');
    //     $averagePendingDaysRI = DB::table('complaints as cmp')
    //         ->where('cmp.status', 'In Progress')
    //         // ->where('application_status', 'pending')
    //         ->select(DB::raw('AVG(DATEDIFF(NOW(), cmp.created_at)) as avg_days'))
    //         ->value('avg_days');
    //     $averagePendingDaysNT = DB::table('complaints as cmp')
    //         ->where('cmp.status', 2)
    //         ->where('application_status', 'pending')
    //         ->where('approved_rejected_by_ri', 1)
    //         ->select(DB::raw('AVG(DATEDIFF(NOW(), cmp.created_at)) as avg_days'))
    //         ->value('avg_days');
    //     $averagePendingDaysT = DB::table('complaints as cmp')
    //         ->where('cmp.status', 2)
    //         ->where('application_status', 'pending')
    //             ->where('approved_rejected_by_ri', 1)
    //     ->where('approved_rejected_by_naibtahsildar', 1)
    //         ->select(DB::raw('AVG(DATEDIFF(NOW(), cmp.created_at)) as avg_days'))
    //         ->value('avg_days');
    //     $averagePendingDaysSDM = DB::table('complaints as cmp')
    //         ->where('cmp.status', 2)
    //         ->where('application_status', 'pending')
    //         ->where('approved_rejected_by_ri', 1)
    //         ->where('approved_rejected_by_naibtahsildar', 1)
    //          ->where('approved_rejected_by_tahsildar', 1)
    //         ->select(DB::raw('AVG(DATEDIFF(NOW(), cmp.created_at)) as avg_days'))
    //         ->value('avg_days');
    //     $averagePendingDaysADM = DB::table('complaints as cmp')
    //         ->where('cmp.status', 2)
    //         ->where('application_status', 'pending')
    //         ->where('approved_rejected_by_ri', 1)
    //         ->where('approved_rejected_by_naibtahsildar', 1)
    //         ->where('approved_rejected_by_tahsildar', 1)
    //         ->where('approved_rejected_by_sdm', 1)
    //         ->select(DB::raw('AVG(DATEDIFF(NOW(), cmp.created_at)) as avg_days'))
    //         ->value('avg_days');

    // $averageDaysForPending = array($averagePendingDaysLekhpal,$averagePendingDaysRI,$averagePendingDaysNT, $averagePendingDaysT,$averagePendingDaysSDM,$averagePendingDaysADM);

    //     $queryLekhpal = DB::table('complaints as cmp')
    //         ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
    //         ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
    //         //  ->where('approved_rejected_by_ri', 1)
    //         // ->where('approved_rejected_by_naibtahsildar', 1)
    //         // ->where('approved_rejected_by_tahsildar', 1)
    //         // ->where('approved_rejected_by_sdm', 1)
    //         ->where('cmp.status', 2)
    //         ->where('application_status','pending');
    //     $pendingLekhpal = $queryLekhpal->orderByDesc('id')->count();

    //      $queryRI = DB::table('complaints as cmp')
    //         // ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
    //         // ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
    //         //  ->where('approved_rejected_by_ri', 1)
    //         // ->where('approved_rejected_by_naibtahsildar', 1)
    //         // ->where('approved_rejected_by_tahsildar', 1)
    //         // ->where('approved_rejected_by_sdm', 1)
    //         // ->where('cmp.status', 2)
    //         ->where('application_status','pending');
    //     $pendingRI = $queryRI->orderByDesc('id')->count();

    //      $queryNT = DB::table('complaints as cmp')
    //         ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
    //         ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
    //          ->where('approved_rejected_by_ri', 1)
    //         // ->where('approved_rejected_by_naibtahsildar', 1)
    //         // ->where('approved_rejected_by_tahsildar', 1)
    //         // ->where('approved_rejected_by_sdm', 1)
    //         ->where('cmp.status', 2)
    //         ->where('application_status','pending');
    //     $pendingNT = $queryNT->orderByDesc('id')->count();

        
    //     $queryT= DB::table('complaints as cmp')
    //     ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
    //     ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
    //     ->where('approved_rejected_by_ri', 1)
    //     ->where('approved_rejected_by_naibtahsildar', 1)
    //     // ->where('approved_rejected_by_tahsildar', 1)
    //     // ->where('approved_rejected_by_sdm', 1)
    //     ->where('cmp.status', 2)
    //     ->where('application_status','pending');
    //     $pendingT = $queryT->orderByDesc('id')->count();
        
        
        
    //     $querySDM = DB::table('complaints as cmp')
    //        ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
    //        ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
    //         ->where('approved_rejected_by_ri', 1)
    //        ->where('approved_rejected_by_naibtahsildar', 1)
    //        ->where('approved_rejected_by_tahsildar', 1)
    //        // ->where('approved_rejected_by_sdm', 1)
    //        ->where('cmp.status', 2)
    //        ->where('application_status','pending');
    //    $pendingSDM = $querySDM->orderByDesc('id')->count();

    //     $queryADM = DB::table('complaints as cmp')
    //         ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
    //         ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
    //          ->where('approved_rejected_by_ri', 1)
    //         ->where('approved_rejected_by_naibtahsildar', 1)
    //         ->where('approved_rejected_by_tahsildar', 1)
    //         ->where('approved_rejected_by_sdm', 1)
    //         ->where('cmp.status', 2)
    //         ->where('application_status','pending');
    //     $pendingADM = $queryADM->orderByDesc('id')->count();
        
    //     $dataPending = array($pendingLekhpal,$pendingRI,$pendingNT,$pendingT,$pendingSDM,$pendingADM);
       
    //     $queryDamage = DB::table('complaints as cmp')
    //         ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
    //         ->join('m_tbl_relieftype as relief', function($join) {
    //             $join->on('cmp.relief_type', '=', 'relief.id')
    //                 ->where('relief.damage_type', '=', 'fully'); // Condition in join
    //         })
    //         ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
    //         // ->select('relief.*')
    //         ->where('cmp.status', 2);

    //     $housedamageFully = $queryDamage->count();

    //       $queryDamagePartially =  DB::table('complaints as cmp')
    //         ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
    //         ->join('m_tbl_relieftype as relief', function($join) {
    //             $join->on('cmp.relief_type', '=', 'relief.id')
    //                 ->where('relief.damage_type', '=', 'partially'); // Condition in join
    //         })
    //         ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
    //         // ->select('relief.*')
    //         ->where('cmp.status', 2);
        
    //      $housedamagePartially = $queryDamagePartially->count();
    //         $dataMonth = array();
    //      for($i = 1 ;$i<13;$i++)
    //         {
    //             if($i <= 9){
    //                 $i = '0'.$i;
    //             }
    //              $submitted = DB::table('complaints')
    //         ->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
    //         ->whereMonth('created_at', $i)
    //         ->groupBy('month')
    //         ->pluck('count', 'month')->toArray();

    //         $housedamageFully = DB::table('complaints as cmp')
    //         // ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
    //         ->join('m_tbl_relieftype as relief', function($join) {
    //             $join->on('cmp.relief_type', '=', 'relief.id')
    //                 ->where('relief.damage_type', '=', 'fully'); // Condition in join
    //         })
    //         // ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
    //         // ->select('relief.*')
    //         ->where('cmp.status', 2)
    //         ->whereMonth('created_at', $i)->count();

    

    //       $queryDamagePartially =  DB::table('complaints as cmp')
    //         // ->leftJoin('users as u', 'cmp.added_by', '=', 'u.id')
    //         ->join('m_tbl_relieftype as relief', function($join) {
    //             $join->on('cmp.relief_type', '=', 'relief.id')
    //                 ->where('relief.damage_type', '=', 'partially'); // Condition in join
    //         })
    //         // ->select('cmp.*', 'u.name as lekhpal_name', 'u.email')
    //         ->select('relief.*')
    //         ->where('cmp.status', 2)
    //         ->whereMonth('created_at', $i)->count();

    //           $damageFullData[] = $housedamageFully ?? 0;
    //           $damagePartiallyData[] = $queryDamagePartially ?? 0;
           
            
    //      }

   


//         $distNameData = [];
//         $totalAppData = [];
//         $approveAppData = [];
//         for($i = 0 ;$i < count($districtdata); $i++){
//                 $distNameData[] = $districtdata[$i]['dist_name'] ?? 0;
//                 $totalAppData[] = $districtdata[$i]['total_applications'] ?? 0;
//                 $approveAppData[] = $districtdata[$i]['total_approved_applications'] ?? 0;
//         }

//          $stages = [
//             ['desg' => 'ri', 'title' => 'Revenue Inspector', 'column' => 'approved_rejected_by_ri', 'prev_column' => 'status', 'prev_value' => 2],
//             ['desg' => 'nt', 'title' => 'Naib Tahsildar', 'column' => 'approved_rejected_by_naibtahsildar', 'prev_column' => 'approved_rejected_by_ri', 'prev_value' => 1],
//             ['desg' => 't', 'title' => 'Tahsildar', 'column' => 'approved_rejected_by_tahsildar', 'prev_column' => 'approved_rejected_by_naibtahsildar', 'prev_value' => 1],
//             ['desg' => 'sdm', 'title' => 'Sub Divisional Magistrate', 'column' => 'approved_rejected_by_sdm', 'prev_column' => 'approved_rejected_by_tahsildar', 'prev_value' => 1],
//             ['desg' => 'adm', 'title' => 'Additional District Magistrate', 'column' => 'approved_rejected_by_adm', 'prev_column' => 'approved_rejected_by_sdm', 'prev_value' => 1],
//         ];

//         $results = [];

//         foreach ($stages as $index => $stage) {
//             $pending = DB::table('complaints')
//                 ->where($stage['column'], 0)
//                 ->where($stage['prev_column'], $stage['prev_value'])
//                 ->count();

//             $delayed = DB::table('complaints')
//                 ->where($stage['column'], 0)
//                 ->where($stage['prev_column'], $stage['prev_value'])
//                 ->whereRaw('DATEDIFF(NOW(), created_at) > 5')
//                 ->count();

//             $averageDays = DB::table('complaints')
//                 ->where($stage['column'], '!=', 0)
//                 ->where($stage['prev_column'], $stage['prev_value'])
//                 ->selectRaw('AVG(DATEDIFF(updated_at, created_at)) as avg_days')
//                 ->value('avg_days');

//             $rejected = DB::table('complaints')
//                 ->where($stage['column'], 2)
//                 // ->where($stage['prev_column'], $stage['prev_value'])
//                 ->count();


//             $results[] = [
//                 'index' => $index + 1,
//                 'title' => $stage['title'],
//                 'average' => round($averageDays ?? 0, 1),
//                 'pending' => $pending,
//                 'delayed' => $delayed,
//                 'rejected' => $rejected,
//                 'desg' => $stage['desg'],
//             ];
//         }

        // $criticalDelay = DB::table('complaints')
        //     ->whereRaw('DATEDIFF(NOW(), created_at) > 15')
        //     ->whereNotIn('complaints.approved_rejected_by_adm', [1, 2])
        //     ->count();
        // $moderateDelay = DB::table('complaints')
        //     ->whereRaw('DATEDIFF(NOW(), created_at) BETWEEN 8 AND 15')
        //     ->whereNotIn('complaints.approved_rejected_by_adm', [1, 2])
        //     ->count();
        // $minorDelay = DB::table('complaints')
        //     ->whereRaw('DATEDIFF(NOW(), created_at) BETWEEN 3 AND 7')
        //     ->whereNotIn('complaints.approved_rejected_by_adm', [1, 2])
        //     ->count();

        // $stats =  DB::table('complaints')->select('cause_of_death')
        //     ->selectRaw('count(*) as count')
        //     ->groupBy('cause_of_death')
        //     ->orderBy('count', 'desc')
        //     ->get();

        // $finalStats = [];
        // foreach ($stats as $stat) {
        //     $svgQuery = DB::table('disastertype')
        //         ->select('svg')
        //         ->whereRaw('? like CONCAT("%", DisasterType, "%")', [$stat->cause_of_death])
        //         ->orWhereRaw('? like CONCAT("%", DisasterType_H, "%")', [$stat->cause_of_death])
        //         ->value('svg');
        //     $finalStats[] = [
        //         'cause_of_death' => $stat->cause_of_death,
        //         'death_count' => $stat->count,
        //         'svg' => $svgQuery
        //     ];
        // }
        // $finalStats = collect($finalStats);

        // $form = cmpPerson::selectRaw("
        //     COUNT(CASE WHEN status = 1 THEN 1 END) as form_a_count,
        //     COUNT(CASE WHEN status = 2 THEN 1 END) as form_b_count,
        //     COUNT(CASE WHEN status = 3 THEN 1 END) as form_c_count
        // ")->first();

            return response()->json([
                'status' => true,
                'dataDashboard' => $dataDashboard,
            ]);
        // return view('admin.housing.admin_housing_dashboard',compact('housepending','houseApproved','houseRejected','totalhousingapp','data','dataPending','averageDaysForPending','damageFullData','damagePartiallyData','distNameData','totalAppData','approveAppData','results'));
    } 

    public function getDepartmentwisData(){
            $departmentdata = DB::table('departments as dm')
    ->leftJoin('complaints as hd', 'hd.department_id', '=', 'dm.id')
    ->select(
        'dm.id as department_id',
        'dm.name as department_name',
        DB::raw('COUNT(hd.id) as total_complains'),
        DB::raw("SUM(CASE WHEN hd.status = 'approved' THEN 1 ELSE 0 END) as total_approved_complains")
    )
    ->groupBy('dm.id', 'dm.name')
    ->having('total_complains', '>', 0)
    ->orderBy('dm.name')
    // ->limit(10)
    ->get();
    $departmentdata = $departmentdata->map(function ($item) {
        if($item->total_complains){
   return [
                'department_id' => $item->department_id,
                'department_name' => $item->department_name,
                'total_complains' => $item->total_complains,
                // 'total_approved_complains' => $item->total_approved_complains,
            ];
        }
         
        })->toArray();
    }
      public function getDistrictGraph(){
        //  $user_district_code = Auth::user()->district_id ?? null;
            $year = now()->year;
         $total = DB::table('complaints')
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', $year)
            // ->where('status', 2)
            // ->where('district_id', $user_district_code)
            // ->where('added_by', $addedBy)
            ->groupBy('month')
            ->pluck('count', 'month')->toArray();

        $pending = DB::table('complaints')
            ->selectRaw('MONTH(updated_at) as month, COUNT(*) as count')
            ->whereYear('updated_at', $year)
            // ->where('application_status', 'pending')
             ->where('status', 'In Progress')
            // ->where('district_id', $user_district_code)
            // ->where('added_by', $addedBy)
            ->groupBy('month')
            ->pluck('count', 'month')->toArray();
        $approved = DB::table('complaints')
            ->selectRaw('MONTH(updated_at) as month, COUNT(*) as count')
            ->whereYear('updated_at', $year)
            // ->where('application_status', 'approved')
             ->where('status', 'Disposed - Accepted')
            // ->where('district_id', $user_district_code)
            // ->where('added_by', $addedBy)
            ->groupBy('month')
            ->pluck('count', 'month')->toArray();
        $rejected = DB::table('complaints')
            ->selectRaw('MONTH(updated_at) as month, COUNT(*) as count')
            ->whereYear('updated_at', $year)
            // ->where('application_status', 'rejected')
             ->where('status', 'Rejected')
            // ->where('district_id', $user_district_code)
            // ->where('added_by', $addedBy)
            ->groupBy('month')
            ->pluck('count', 'month')->toArray();

            // dd($approved);

        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $pendingData = [];
        $approvedData = [];
        $rejecteddData = [];
        $totalData = [];

        for ($i = 1; $i <= 12; $i++) {
            $pendingData[] = $pending[$i] ?? 0;
            $totalData[]=$total[$i] ?? 0;
            $approvedData[] = $approved[$i] ?? 0;
            $rejecteddData[]= $rejected[$i] ?? 0;
        }

        return response()->json([
            'pending' =>$pendingData,
            'approved' =>$approvedData,
            'rejected' =>$rejecteddData,
            'total' =>$totalData,
        ]);

    }

//      public function getBlockGraph(){
//          $user_district_code = Auth::user()->district_id ?? null;
//          $user_tehsil_code = Auth::user()->tehsil_id ?? null;
//          $user_block_code = Auth::user()->block_id ?? null;

//     //     //  dd($user_district_code,$user_tehsil_code,$user_block_code);
//     //         $blockdata = DB::table('block_master as bm')
//     // ->leftJoin('complaints as hd', 'hd.block_id', '=', 'bm.block_code')
//     // // ->leftJoin('district_master as dm', 'hd.district_id', '=', 'dm.dist_code')
//     // // ->leftJoin('tehsil_master as tm', 'hd.tahsil_id', '=', 'dm.tehsil_code')
//     // ->select(
//     //     'bm.block_code as block_id',
//     //     'bm.block_name',
//     //     'hd.*',
//     //     // DB::raw('COUNT(hd.id) as total_applications'),
//     //     // DB::raw("SUM(CASE WHEN hd.application_status = 'approved' THEN 1 ELSE 0 END) as total_approved_applications")
//     // )
//     // ->groupBy('bm.block_code', 'bm.block_name')
//     // // ->having('total_applications', '>', 0)
//     // // ->orderBy('bm.block_name')
//     // // ->limit(10)
//     // ->get();
// $blockdata = DB::table('block_master as bm')
//     ->leftJoin('complaints as hd', 'hd.block_id', '=', 'bm.id') // use inner join to exclude empty blocks
//     ->select(
//         'bm.block_code as block_id',
//         'bm.block_name',
//         // DB::raw('COUNT(hd.id) as total_applications'),
//         DB::raw("SUM(CASE WHEN hd.form_status = '2' THEN 1 ELSE 0 END) as total_applications"),
//         DB::raw("SUM(CASE WHEN hd.application_status = 'pending' AND hd.form_status = '2' THEN 1 ELSE 0 END) as total_pending_applications"),
//         DB::raw("SUM(CASE WHEN hd.application_status = 'approved' AND hd.form_status = '2' THEN 1 ELSE 0 END) as total_approved_applications")
//     )
//     ->groupBy('bm.block_code', 'bm.block_name')
//     ->having('total_applications', '>', 0)
//     ->limit(5)
//     // ->where('block_id',$user_block_code)
//     // ->orderBy('bm.block_name', 'asc')
//     ->get();
//     // $housingDetails = DB::table('complaints')
//     // ->whereIn('block_id', $blockdata->pluck('block_id'))
//     // ->get();
//     // dd($blockdata);
//     $blockdata = $blockdata->map(function ($item) {
//         if($item->total_applications){
//    return [
//                 'block_id' => $item->block_id,
//                 'block_name' => $item->block_name,
//                 'total_applications' => $item->total_applications,
//                 'total_pending_applications' => $item->total_pending_applications,
//                 'total_approved_applications' => $item->total_approved_applications,
//             ];
//         }
         
//         })->toArray();

//         $blockNameData = [];
//         $totalAppData = [];
//         $approveAppData = [];
//         $pendingAppData = [];
//         for($i = 0 ;$i < count($blockdata); $i++){
//                 $blockNameData[] = $blockdata[$i]['block_name'] ?? 0;
//                 $totalAppData[] = $blockdata[$i]['total_applications'] ?? 0;
//                 $approveAppData[] = $blockdata[$i]['total_approved_applications'] ?? 0;
//                 $pendingAppData[] = $blockdata[$i]['total_pending_applications'] ?? 0;
//         }

//         return response()->json([
//             'block' => $blockNameData,
//             'total' => $totalAppData,
//             'approve' => $approveAppData,
//             'pending' => $pendingAppData
//         ]);
//         // dd($approveAppData,$totalAppData,$distNameData,$pendingAppData);

//     }

}
