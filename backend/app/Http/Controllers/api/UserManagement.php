<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserManagement extends Controller
{
    public function user_management(Request $request)
{
    // Validate input
    $validator = Validator::make($request->all(), [
        'name'         => 'required|string|max:255',
        'email'        => 'required|email|unique:users,email',
        'number'       => 'nullable|string|max:235',
        'role_id'      => 'required|exists:roles,id',
        'designation'  => 'nullable|string|max:230',
        'department'   => 'nullable|string|max:200',
        'district_id'  => 'required|exists|districts'
    ], [
      
        'name.required'        => 'Name is required.',
        'email.required'       => 'Email is required.',
        'email.email'          => 'Enter a valid email address.',
        'email.unique'         => 'This email is already in use.',
        'role_id.required'     => 'Please select a role.',
        'role_id.exists'       => 'Selected role does not exist.',
    ]);

    // If validation fails
    if ($validator->fails()) {
        return response()->json([
            'status' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    
    $baseUserName = \Str::slug($request->name); 
    $count = User::where('user_name', 'LIKE', "$baseUserName%")->count();
    $userName = $count > 0 ? $baseUserName . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT) : $baseUserName . '-001';

    $user = User::create([
        'name'         => $request->name,
        'email'        => $request->email,
        'number'       => $request->number,
        'role_id'      => $request->role_id,
        'designation'  => $request->designation,
        'department'   => $request->department,
        'user_name'    => $userName,
        'password'     => bcrypt('password123'), // default password (change as needed)
    ]);
    dd($user);

    return response()->json([
        'status' => true,
        'message' => 'User created successfully',
        'data' => $user->only([
            'id', 'name', 'email', 'number', 'role_id', 'designation', 'department', 'user_name'
        ])
    ]);
}
}
