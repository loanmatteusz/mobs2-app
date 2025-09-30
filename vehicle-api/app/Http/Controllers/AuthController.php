<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $token = auth('api')->attempt($credentials);

        if (!$token)
        {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => (config('jwt.ttl') ?? 60) * 60,
        ]);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:3', 'confirmed'],
        ]);

        $user = User::create($data);

        $token = auth('api')->login($user);

        return response()->json([
            'user'        => $user,
            'access_token' => $token,
            'token_type'  => 'bearer',
            'expires_in'  => (config('jwt.ttl') ?? 60) * 60,
        ], 201);
    }
}
