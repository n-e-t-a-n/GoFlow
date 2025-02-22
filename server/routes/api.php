<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\BoardController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\TaskListController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\UserBoardController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [UserController::class, 'login']);
    Route::post('/register', [UserController::class, 'register']);
    
    Route::middleware('auth:sanctum')-> group(function () {
        Route::post('/logout', [UserController::class, 'logout']);
        Route::post('/verify', function (Request $request) {
            return $request->user();
        });
    });
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

    Route::prefix('task')->group(function () {
        Route::get('/{boardId}', [TaskController::class, 'index']);
        Route::post('/', [TaskController::class, 'create']);
        Route::put('/{taskId}/edit', [TaskController::class, 'edit']);
        Route::put('/{taskId}/move', [TaskController::class, 'move']);
        Route::put('/{taskId}/assignee', [TaskController::class, 'setAssignee']);
        Route::put('/{taskId}/status', [TaskController::class, 'setStatus']);
        Route::put('/{taskId}/due-date', [TaskController::class, 'setDueDate']);
        Route::put('/{taskId}/priority', [TaskController::class, 'setPriority']);
    });

    Route::prefix('user-board')->group(function () {
        Route::get('/{boardId}', [UserBoardController::class, 'index']);
        Route::post('/{boardId}', [UserBoardController::class, 'add']);
        Route::delete('/{boardId}/user/{userId}', [UserBoardController::class, 'remove']);
        Route::put('/{boardId}/user/{userId}/promote', [UserBoardController::class, 'promote']);
        Route::put('/{boardId}/user/{userId}/demote', [UserBoardController::class, 'demote']);
    });
});

