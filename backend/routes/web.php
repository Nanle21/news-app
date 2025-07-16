<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('welcome');
});

// Email verification route (for links sent via email)
Route::get('/email/verify/{id}/{hash}', function ($id, $hash) {
    $user = \App\Models\User::find($id);
    
    if (!$user) {
        return response()->json(['message' => 'Invalid verification link'], 400);
    }
    
    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email already verified'], 400);
    }
    
    if (!hash_equals(sha1($user->getEmailForVerification()), $hash)) {
        return response()->json(['message' => 'Invalid verification link'], 400);
    }
    
    if ($user->markEmailAsVerified()) {
        event(new \Illuminate\Auth\Events\Verified($user));
    }
    
    return response()->json([
        'message' => 'Email verified successfully! You can now access all features.',
        'user' => $user->fresh()
    ]);
})->name('verification.verify');

// API test endpoint
Route::get('/api/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'timestamp' => now(),
        'status' => 'success'
    ]);
});
