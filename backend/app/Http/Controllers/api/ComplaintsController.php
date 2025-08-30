<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ComplaintsController extends Controller
{
    public function complaint_register(Request $request)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'mobile' => 'required|digits_between:10,15',
            'address' => 'required|string|max:255',
            'district_id' => 'required|exists:district_master,district_code',
            'email' => 'required|email|unique:complaints,email',
            'dob' => 'nullable|date',
            'fee_exempted' => 'required|boolean',
            'department' => 'required|in:lok_nirman,education,health,police',
            'officer_name' => 'required|string|max:255',
            'designation' => 'required|in:collector,ceo,engineer',
            'category' => 'required|in:class_1,class_2',
            'subject' => 'required|in:corruption,delay_in_work,misbehavior,rule_violation',
            'nature' => 'required|in:allegation,grievance',
            'description' => 'required|string',
        ], [
            'name.required' => 'Name is required.',
            'mobile.required' => 'Mobile number is required.',
            'mobile.digits_between' => 'Mobile number must be between 10 to 15 digits.',
            'address.required' => 'Address is required.',
            'district_id.required' => 'District is required.',
            'district_id.exists' => 'District does not exist.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already registered.',
            'dob.date' => 'Date of Birth must be a valid date.',
            'fee_exempted.required' => 'Please specify if fee is exempted or not.',
            'department.required' => 'Department is required.',
            'officer_name.required' => 'Officer name is required.',
            'designation.required' => 'Designation is required.',
            'category.required' => 'Category is required.',
            'subject.required' => 'Subject is required.',
            'nature.required' => 'Nature of complaint is required.',
            'description.required' => 'Complaint description is required.',
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $complaint = new Complaint();
        $complaint->name = $request->name;
        $complaint->mobile = $request->mobile;
        $complaint->address = $request->address;
        $complaint->district_id = $request->district_id;
        $complaint->email = $request->email;
        $complaint->amount = $request->amount;
        $complaint->challan_no = $request->challan_no;
        $complaint->dob = $request->dob;
        $complaint->fee_exempted = $request->fee_exempted;
        $complaint->department = $request->department;
        $complaint->officer_name = $request->officer_name;
        $complaint->designation = $request->designation;
        $complaint->category = $request->category;
        $complaint->subject = $request->subject;
        $complaint->nature = $request->nature;
        $complaint->description = $request->description;
        $complaint->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Complaint registered successfully.',
            'data' => $complaint
        ], 201);
    }


public function checkDuplicate()
{
    $complaints = Complaint::all();
    $duplicates = [];
    $checked = [];

    foreach ($complaints as $complaint) {
        foreach ($complaints as $other) {
            if ($complaint->id !== $other->id && !in_array([$other->id, $complaint->id], $checked)) {
                $matchCount = 0;
                $totalFields = 0;

                // Fields to compare
                $fields = ['name', 'mobile', 'email', 'subject', 'district_id'];

                foreach ($fields as $field) {
                    $totalFields++;
                    if (!empty($complaint->$field) && $complaint->$field == $other->$field) {
                        $matchCount++;
                    }
                }

                $percentage = ($totalFields > 0) ? ($matchCount / $totalFields) * 100 : 0;

                if ($percentage >= 50) {
                    $duplicates[] = [
                        'complaint_id'   => $complaint->id,
                        'name'           => $complaint->name,
                        'subject'        => $complaint->subject,
                        'district_id'    => $complaint->district_id,

                        'duplicate_with' => $other->id,
                        'dup_name'       => $other->name,
                        'dup_subject'    => $other->subject,
                        'dup_district_id'=> $other->district_id,

                        'match_percentage' => round($percentage, 2)
                    ];

                    // Mark pair as checked
                    $checked[] = [$complaint->id, $other->id];
                }
            }
        }
    }

    return response()->json([
        'status' => 'success',
        'message' => 'Duplicate check completed',
        'duplicates' => $duplicates
    ]);
}


public function progress_report(){
    
}
}
