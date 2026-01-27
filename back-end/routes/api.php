<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PlayerProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public API routes
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'PicklePlay API is running',
        'timestamp' => now()->toISOString()
    ]);
});

// Authentication routes (public)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    
    // Email verification (signed route)
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware('signed')
        ->name('verification.verify');
});

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/profile/extended', [AuthController::class, 'updateExtendedProfile']);
        Route::put('/preferences', [AuthController::class, 'updatePreferences']);
        Route::post('/profile/photo', [AuthController::class, 'uploadProfilePhoto']);
        Route::post('/profile/cover', [AuthController::class, 'uploadCoverPhoto']);
        Route::put('/password', [AuthController::class, 'updatePassword']);
        Route::delete('/profile', [AuthController::class, 'deleteAccount']);
        Route::post('/email/resend', [AuthController::class, 'sendVerificationEmail']);
        Route::get('/logs', [AuthController::class, 'getAuthLogs']);
        Route::get('/logs/all', [AuthController::class, 'getAllAuthLogs']); // Admin only
    });
    
    // Player Profile routes
    Route::prefix('player')->group(function () {
        Route::get('/profile', [PlayerProfileController::class, 'getProfile']);
        Route::put('/profile', [PlayerProfileController::class, 'updateProfile']);
        Route::post('/profile/photo', [PlayerProfileController::class, 'uploadPhoto']);
        Route::get('/profile/completion', [PlayerProfileController::class, 'getCompletion']);
        Route::delete('/profile', [PlayerProfileController::class, 'deleteProfile']);
    });
    
    // Legacy user route
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// API v1 routes group
Route::prefix('v1')->group(function () {
    // Courts routes (example)
    // Route::get('/courts', [CourtController::class, 'index']);
    // Route::get('/courts/{id}', [CourtController::class, 'show']);
    
    // Add your API routes here
});
