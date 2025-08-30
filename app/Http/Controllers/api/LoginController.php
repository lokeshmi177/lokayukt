<?php

namespace App\Http\Controllers\api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function login(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email|exists:users,email',
            'password' => 'required|string|min:6',
        ], [
            'email.exists' => 'This email is not registered.',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $user = User::where('email', $request->email)->first();

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
}
