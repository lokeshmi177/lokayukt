<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
public function login(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'user_name' => 'required|exists:users,user_name',
            'password'  => 'required|string|min:6',
        ], [
            'user_name.exists' => 'This username is not registered.',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $user = User::where('user_name', $request->user_name)->first();

        // Password check
        if (!Hash::check($request->password, $user->password)) {
            return ApiResponse::generateResponse('error', 'Wrong password.', null, 401);
        }

        if ($user->status == 0) {
            return ApiResponse::generateResponse('error', 'You are blocked by admin.', null, 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return ApiResponse::generateResponse('success', 'Login Successful.', [
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user,
        ]);

    } catch (ValidationException $e) {
        $errors = collect($e->validator->errors()->toArray())
            ->map(fn($messages) => $messages[0]);

        return ApiResponse::generateResponse('error', 'Validation failed.', $errors, 422);
    } catch (\Exception $e) {
        return ApiResponse::generateResponse('error', 'Something went wrong during login.', [
            'message' => $e->getMessage(),
        ], 500);
    }
}


public function forgotPasswordCheck(Request $request)
{
    $request->validate(['user_name' => 'required|string']);

    $user = User::where('user_name', $request->user_name)->first();

    if (! $user) {
        return ApiResponse::generateResponse('error', 'Please enter correct Username.', null, 404);
    }

    return ApiResponse::generateResponse('success', 'Username found. Proceed to send OTP.');
}


public function sendOtp(Request $request)
{
    $request->validate(['user_name' => 'required|string']);

    $user = User::where('user_name', $request->user_name)->first();

    if (! $user) {
        return ApiResponse::generateResponse('error', 'Username not found.', null, 404);
    }

    $user->otp = '12345'; 
    $user->save();

    return ApiResponse::generateResponse('success', 'OTP sent successfully.');
}


public function verifyOtp(Request $request)
{
    $request->validate([
        'user_name' => 'required|string',
        'otp'       => 'required',
    ]);

    $user = User::where('user_name', $request->user_name)->first();

    if (! $user || $user->otp !== $request->otp) {
        return ApiResponse::generateResponse('error', 'Invalid OTP.', null, 403);
    }

    return ApiResponse::generateResponse('success', 'OTP verified successfully.');
}





public function resetPassword(Request $request)
{
    $validator = Validator::make($request->all(), [
        'user_name' => 'required|string',
        'otp'       => 'required',
        'password'  => 'required|confirmed|min:8',
    ], [
        'user_name.required' => 'Username is mandatory.',
        'otp.required'       => 'OTP is required.',
        'password.required'  => 'Enter correct password.',
        'password.confirmed' => 'Password and Confirm Password do not match.',
        'password.min'       => 'Password must contain at least 8 characters.',
    ]);

    $validator->after(function ($validator) use ($request) {
        $password = $request->password;

        if (!preg_match('/[A-Z]/', $password)) {
            $validator->errors()->add('password', 'Password must contain at least one uppercase letter.');
        }
        if (!preg_match('/[0-9]/', $password)) {
            $validator->errors()->add('password', 'Password must contain at least one number.');
        }
        if (!preg_match('/[^a-zA-Z0-9]/', $password)) {
            $validator->errors()->add('password', 'Password must contain at least one special character.');
        }
    });

    if ($validator->fails()) {
        return ApiResponse::generateResponse('error', 'Validation failed.', $validator->errors()->toArray(), 422);
    }

    $user = User::where('user_name', $request->user_name)->first();
    if (! $user) {
        return ApiResponse::generateResponse('error', 'Username not found.', null, 404);
    }

    if ($user->otp !== $request->otp) {
        return ApiResponse::generateResponse('error', 'Invalid OTP.', null, 403);
    }

    $user->password = Hash::make($request->password);
    $user->otp = null;
    $user->save();

    return ApiResponse::generateResponse('success', 'Password reset successful.');
}

  public function logout(Request $request){

        $request->user()->currentAccessToken()->delete();

        return ApiResponse::generateResponse('success','Logout Successfully');
    }
}
