@extends('layouts.app')

@section('title', 'Login - LokAyukta CRMS')

@section('content')
<div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
        <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">Login to LokAyukta CRMS</h2>

        @if(session('error'))
            <div class="bg-red-100 text-red-700 p-3 mb-5 rounded-md text-center">
                {{ session('error') }}
            </div>
        @endif

        <form action="#" method="POST" class="space-y-6">
            @csrf

            <div>
                <label for="username" class="block text-gray-700 font-medium mb-2">Username</label>
                <input type="text" name="username" id="username" value=""
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none">
                @error('username')
                    <span class="text-red-600 text-sm mt-1 block">{{ $message }}</span>
                @enderror
            </div>

            <div>
                <label for="password" class="block text-gray-700 font-medium mb-2">Password</label>
                <input type="password" name="password" id="password"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none">
                @error('password')
                    <span class="text-red-600 text-sm mt-1 block">{{ $message }}</span>
                @enderror
            </div>

            <button type="submit"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all">
                Login
            </button>
        </form>

        <p class="mt-6 text-center text-gray-500 text-sm">
            &copy; {{ date('Y') }} LokAyukta CRMS. All rights reserved.
        </p>
    </div>
</div>
@endsection
