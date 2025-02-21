<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Models\Board;
use App\Models\UserBoard;

use App\Http\Requests\StoreBoardRequest;
use App\Http\Requests\UpdateBoardRequest;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::id());

        return response()->json($user->boards);
    }

    public function create(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $user = Auth::user();

        try {
            $board = Board::create([
                'name' => $request->name,
                'description' => $request->description,
            ]);

            UserBoard::create([
                'user_id' => $user->id,
                'board_id' => $board->id,
                'role' => 'admin',
            ]);

            return response()->json([
                'message' => 'Board created successfully.',
                'board' => $board
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while creating the board.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $boardId)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $user = Auth::user();

        try {
            $board = Board::find($boardId);

            if (!$board) {
                return response()->json([
                    'message' => 'Board not found.',
                ], 404);
            }

            $userBoard = UserBoard::where('user_id', $user->id)
                                ->where('board_id', $board->id)
                                ->first();

            if (!$userBoard || $userBoard->role !== 'admin') {
                return response()->json([
                    'message' => 'You are not authorized to update this board.',
                ], 403);
            }

            $board->update([
                'name' => $request->name ?? $board->name,
                'description' => $request->description ?? $board->description,
            ]);

            return response()->json([
                'message' => 'Board updated successfully!',
                'board' => $board,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while editing the board details.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}