<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

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
});

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);
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
