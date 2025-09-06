<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        dd($request->all(),$roles);
    
        // if(!Auth::check()){
        //     return redirect('/admin/login')->with('error','Please login first');
        // }

        // return $next($request);
        
        // if (!Auth::check()) {
        //     return redirect('/admin/login');
        // }

        // $userRole = Auth::user()->role->name ?? null; // ✅ updated line
        // if (!$userRole) {
        //     abort(403, 'No role assigned to user.');
        // }

        // if (in_array($userRole, $roles)) {
        //     return $next($request);
        // }

        // abort(403, 'Unauthorized access.');
        //  if (!Auth::check()) {
        //     // User not logged in → redirect for web, or 401 for API
        //     // if ($request->expectsJson()) {
        //     //     return response()->json(['message' => 'Unauthorized'], 401);
        //     // }
        //     return redirect('/login');
        // }

        // $userRole = User::where('',)->role->name ?? null; // ✅ updated line

        // if (!$userRole) {
        //     abort(403, 'No role assigned to user.');
        // }

        // if (in_array($userRole, $roles)) {
            return $next($request);
        // }

        // abort(403, 'Unauthorized access.');
    }
}
