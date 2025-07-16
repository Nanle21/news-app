<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\DataSourceController;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::get('profile', [AuthController::class, 'profile'])->middleware('auth:api');
    Route::put('profile', [AuthController::class, 'updateProfile'])->middleware('auth:api');
    
    // Email verification routes
    Route::post('email/verification-notification', [AuthController::class, 'resendVerificationEmail'])->middleware('auth:api');
    Route::post('email/verify', [AuthController::class, 'verifyEmail'])->middleware('auth:api');
});

// Basic authenticated routes (no email verification required)
Route::middleware('auth:api')->group(function () {
    // These routes allow access even without email verification
    Route::get('articles/categories', [ArticleController::class, 'categories']);
    Route::get('articles/sources', [ArticleController::class, 'sources']);
});

// Article routes (require authentication AND email verification)
Route::middleware(['auth:api', 'verified'])->group(function () {
    Route::get('articles/search', [ArticleController::class, 'search']);
    Route::get('articles/feed', [ArticleController::class, 'feed']);
    Route::get('articles/preferences', [ArticleController::class, 'getPreferences']);
    Route::put('articles/preferences', [ArticleController::class, 'updatePreferences']);
    Route::delete('articles/preferences', [ArticleController::class, 'resetPreferences']);
    Route::get('articles/dashboard-stats', [ArticleController::class, 'dashboardStats']);
    
    // Bookmark routes
    Route::get('bookmarks', [BookmarkController::class, 'index']);
    Route::post('articles/{article}/bookmark', [BookmarkController::class, 'toggle']);
    Route::get('articles/{article}/bookmark', [BookmarkController::class, 'check']);
});

// Data source management routes (require authentication AND email verification)
Route::middleware(['auth:api', 'verified'])->group(function () {
    Route::apiResource('data-sources', DataSourceController::class);
    Route::post('data-sources/{dataSource}/test', [DataSourceController::class, 'test']);
    Route::post('data-sources/{dataSource}/fetch', [DataSourceController::class, 'fetch']);
}); 