<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\BoardController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\TaskListController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [UserController::class, 'login']);
    Route::post('/register', [UserController::class, 'register']);
    
    Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {    
    Route::prefix('board')->group(function () {
        Route::get('/', [BoardController::class, 'index']);
        Route::post('/', [BoardController::class, 'create']);
        Route::put('/{boardId}', [BoardController::class, 'update']);
    });

    Route::prefix('list')->group(function () {
        Route::get('/{boardId}', [TaskListController::class, 'index']);
        Route::post('/', [TaskListController::class, 'create']);
        Route::put('/{listId}', [TaskListController::class, 'update']);
    });
});

