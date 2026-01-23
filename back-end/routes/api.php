<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public API routes
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'PicklePlay API is running',
        'timestamp' => now()->toISOString()
    ]);
});

// API v1 routes group
Route::prefix('v1')->group(function () {
    // Courts routes (example)
    // Route::get('/courts', [CourtController::class, 'index']);
    // Route::get('/courts/{id}', [CourtController::class, 'show']);
    
    // Add your API routes here
});
