<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Models\UserBoard;

use App\Http\Requests\StoreUserBoardRequest;
use App\Http\Requests\UpdateUserBoardRequest;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;

class UserBoardController extends Controller
{
    private function isMember($boardId)
    {
        $userBoard = UserBoard::where('user_id', Auth::id())
                              ->where('board_id', $boardId)
                              ->first();

        return $userBoard;
    }

    private function isAdmin($boardId)
    {
        $userBoard = UserBoard::where('user_id', Auth::id())
                              ->where('board_id', $boardId)
                              ->first();

        return $userBoard && $userBoard->role === 'admin';
    }

    private function getUserIdByEmail($email)
    {
        $user = User::where('email', $email)->first();

        if ($user) return $user->id;  
        
        return null;
    }

    public function index(Request $request, $boardId)
    {
        if (!$this->isMember($boardId)) {
            return response()->json(['message' => 'You are not authorized to view the members of this board.'], 403);
        }

        $members = UserBoard::where('board_id', $boardId)
                            ->with('user') 
                            ->get()
                            ->map(function ($userBoard) {
                                return [
                                    'user_id' => $userBoard->user_id,
                                    'name' => $userBoard->user->name,
                                    'email' => $userBoard->user->email,
                                    'role' => $userBoard->role,
                                ];
                            });

        return response()->json($members);
    }

    public function add(Request $request, $boardId)
    {
        if (!$this->isAdmin($boardId)) {
            return response()->json(['message' => 'You are not authorized to add a member to this board.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email', 
            'role' => 'nullable|in:member,admin',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        $user = User::where('email', $validatedData['email'])->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $userExists = UserBoard::where('user_id', $user->id)
                                ->where('board_id', $boardId)
                                ->first();

        if ($userExists) {
            return response()->json(['message' => 'User already in board.'], 400);
        }

        $newUserBoard = UserBoard::create([
            'user_id' => $user->id,
            'board_id' => $boardId,
            'role' => $validatedData['role'] ?? 'member',
        ]);

        $newUserBoard['name'] = $user->name;

        return response()->json($newUserBoard);
    }


    public function remove(Request $request, $boardId)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!$this->isAdmin($boardId)) {
            return response()->json(['message' => 'You are not authorized to remove a member from this board.'], 403);
        }

        $validatedData = $validator->validated();

        $userId = $this->getUserIdByEmail($validatedData['email']);

        $userBoard = DB::table('user_boards')
                    ->where('user_id', $userId)
                    ->where('board_id', $boardId)
                    ->first();

        if (!$userBoard) {
            return response()->json(['message' => 'User is not a member of this board.'], 400);
        }

        DB::table('user_boards')
            ->where('user_id', $userId)
            ->where('board_id', $boardId)
            ->delete();

        return response()->json(['message' => 'User removed from board successfully.']);
    }


    public function promote(Request $request, $boardId, $userId)
    {
        if (!$this->isAdmin($boardId)) {
            return response()->json(['message' => 'You are not authorized to promote a member to admin.'], 403);
        }

        $userBoard = DB::table('user_boards')
                    ->where('user_id', $userId)
                    ->where('board_id', $boardId)
                    ->first();

        if (!$userBoard || $userBoard->role !== 'member') {
            return response()->json(['message' => 'User is not a member of this board or already an admin.'], 400);
        }

        DB::table('user_boards')
            ->where('user_id', $userId)
            ->where('board_id', $boardId)
            ->update(['role' => 'admin']);

        return response()->json(['message' => 'User promoted to admin successfully.']);
    }


    public function demote(Request $request, $boardId, $userId)
    {
        if (!$this->isAdmin($boardId)) {
            return response()->json(['message' => 'You are not authorized to demote a member from admin.'], 403);
        }

        $userBoard = DB::table('user_boards')
                    ->where('user_id', $userId)
                    ->where('board_id', $boardId)
                    ->first();

        if (!$userBoard || $userBoard->role !== 'admin') {
            return response()->json(['message' => 'User is not an admin of this board.'], 400);
        }

        DB::table('user_boards')
            ->where('user_id', $userId)
            ->where('board_id', $boardId)
            ->update(['role' => 'member']);

        return response()->json(['message' => 'User demoted from admin successfully.']);
    }
}
