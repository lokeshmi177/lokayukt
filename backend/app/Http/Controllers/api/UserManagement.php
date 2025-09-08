<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UserManagement extends Controller
{
    public function index()
    {
        $users = User::with('role')->get();
        return response()->json([
            'status' => true,
            'data' => $users
        ]);
    }

    // public function user_management(Request $request)
    // {
    //     // ✅ Updated validation - ComplaintsController pattern के according
    //     $validator = Validator::make($request->all(), [
    //         'name'         => 'required|string|max:255',
    //         'email'        => 'required|email|unique:users,email',
    //         'password'     => [
    //             'required',
    //             'string',
    //             'min:8',
    //             'confirmed',
    //             'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'
    //         ],
    //         'number'       => 'required|numeric|digits:10|unique:users,number',
    //         'role_id'      => 'required|exists:roles,id',
    //         'designation'  => 'required|integer|min:1',  // ✅ Changed to required integer
    //         'department'   => 'required|integer|min:1',  // ✅ Changed to required integer
    //         'district_id'  => 'required|exists:district_master,district_code',
    //     ], [
    //         'name.required'        => 'Name is required.',
    //         'email.required'       => 'Email is required.',
    //         'email.email'          => 'Enter a valid email address.',
    //         'email.unique'         => 'This email is already in use.',
    //         'password.required'    => 'Password is required.',
    //         'password.min'         => 'Password must be at least 8 characters.',
    //         'password.confirmed'   => 'Password confirmation does not match.',
    //         'password.regex'       => 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
    //         'role_id.required'     => 'Please select a role.',
    //         'role_id.exists'       => 'Selected role does not exist.',
    //         'designation.required' => 'Please select a designation.',  // ✅ Updated
    //         'designation.integer'  => 'Invalid designation selection.',  // ✅ Added
    //         'department.required'  => 'Please select a department.',   // ✅ Updated
    //         'department.integer'   => 'Invalid department selection.',  // ✅ Added
    //         'district_id.required' => 'Please select a district.',
    //         'district_id.exists'   => 'Selected district does not exist.',
    //         'number.required'      => 'Please enter the mobile number.',
    //         'number.numeric'       => 'Mobile number must be numeric.',
    //         'number.digits'        => 'Mobile number must be exactly 10 digits.',
    //         'number.unique'        => 'This mobile number is already registered.',
    //     ]);

    //     // If validation fails
    //     if ($validator->fails()) {
    //         return response()->json([
    //             'status' => false,
    //             'errors' => $validator->errors()
    //         ], 422);
    //     }

    //     $baseUserName = Str::slug($request->name);
    //     $count = User::where('user_name', 'LIKE', "$baseUserName%")->count();
    //     $userName = $count > 0 ? $baseUserName . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT) : $baseUserName . '-001';

    //     // ✅ Updated User::create() - ComplaintsController pattern के according
    //     $user = User::create([
    //         'name'           => $request->name,
    //         'email'          => $request->email,
    //         'number'         => $request->number,
    //         'role_id'        => $request->role_id,
    //         'district_id'    => $request->district_id,
    //         'designation_id' => $request->designation,  // ✅ designation → designation_id
    //         'department_id'  => $request->department,   // ✅ department → department_id
    //         'user_name'      => $userName,
    //         'password1'      => $request->password,
    //         'password'       => bcrypt('password123'),
    //     ]);

    //     return response()->json([
    //         'status' => true,
    //         'message' => 'User created successfully',
    //         'data' => $user->only([
    //             'id',
    //             'name',
    //             'email',
    //             'number',
    //             'role_id',
    //             'designation_id',  // ✅ Updated field name
    //             'department_id',   // ✅ Updated field name
    //             'district_id',     // ✅ Added for consistency
    //             'user_name'
    //         ])
    //     ]);
    // }

    public function user_management(Request $request)
    {
        // dd($request->all());
        // Validate input
        $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email',
            'password'       => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'
            ],
            'number'         => 'required|numeric|digits:10|unique:users,number',
            'role_id'      => 'required|exists:roles,id',
            'designation'  => 'required',
            'department'   => 'required',
            'district_id'  => 'required|exists:district_master,district_code',
        ], [
            'name.required'        => 'Name is required.',
            'email.required'       => 'Email is required.',
            'email.email'          => 'Enter a valid email address.',
            'email.unique'         => 'This email is already in use.',
            'password.required'    => 'Password is required.',
            'password.min'         => 'Password must be at least 8 characters.',
            'password.confirmed'   => 'Password confirmation does not match.',
            'password.regex'       => 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
            'role_id.required'     => 'Please select a role.',
            'role_id.exists'       => 'Selected role does not exist.',
            'department.required'     => 'Please select a department.',
            'designation.required'     => 'Please select a designation.',
            'district_id.required'     => 'Please select a district.',
            'district_id.exists'       => 'Selected district does not exist.',
             'number.required'         => 'Please enter the mobile number.',
        'number.numeric'          => 'Mobile number must be numeric.',
        'number.digits'           => 'Mobile number must be exactly 10 digits.',
        'number.unique'           => 'This mobile number is already registered.',
        ]);
        // If validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        $baseUserName = Str::slug($request->name);
        $count = User::where('user_name', 'LIKE', "$baseUserName%")->count();
        $userName = $count > 0 ? $baseUserName . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT) : $baseUserName . '-001';
        $user = User::create([
            'name'         => $request->name,
            'email'        => $request->email,
            'number'       => $request->number,
            'role_id'      => $request->role_id,
            'district_id'  => $request->district_id,
            'designation_id'  => $request->designation,
            'department_id'   => $request->department,
            'user_name'    => $userName,
            'password1'    => $request->password,
            'password'     => bcrypt('password123'),
        ]);
        // dd($user);
        return response()->json([
            'status' => true,
            'message' => 'User created successfully',
            'data' => $user->only([
                'id',
                'name',
                'email',
                'number',
                'role_id',
                'designation',
                'department',
                'user_name'
            ])
        ]);
    }





}
