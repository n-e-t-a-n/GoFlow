<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\StoreTaskListRequest;
use App\Http\Requests\UpdateTaskListRequest;

use App\Http\Controllers\Controller;

use App\Models\Board;
use App\Models\TaskList;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TaskListController extends Controller
{
    public function index($boardId)
    {
        $board = Board::find($boardId);
        
        if (!$board) {
            return response()->json(['message' => 'Board not found.'], 404);
        }

        $userBoard = $board->users()->where('user_id', Auth::id())->first();
        
        if (!$userBoard) {
            return response()->json(['message' => 'Unauthorized: You are not a member of this board.'], 403);
        }

        $taskLists = TaskList::where('board_id', $boardId)->get();

        return response()->json([
            'message' => 'Task Lists retrieved successfully!',
            'taskLists' => $taskLists,
        ]);
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'board_id' => 'required|exists:boards,id',
            'name' => 'required|string|max:255',
            'priority' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $board = Board::find($request->board_id);

        $userBoard = $board->users()->where('user_id', Auth::id())->first();
        
        if (!$userBoard || $userBoard->pivot->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized: Only admins can create task lists.'], 403);
        }

        $taskList = TaskList::create([
            'board_id' => $request->board_id,
            'name' => $request->name,
            'priority' => $request->priority,
        ]);

        return response()->json([
            'message' => 'Task List created successfully!',
            'taskList' => $taskList,
        ], 201);
    }

    public function update(Request $request, TaskList $tasklist)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'priority' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $board = $tasklist->board;
        $userBoard = $board->users()->where('user_id', Auth::id())->first();

        if (!$userBoard || $userBoard->pivot->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized: Only admins can edit task lists.'], 403);
        }

        if ($request->has('name')) {
            $tasklist->name = $request->name;
        }

        if ($request->has('priority')) {
            $tasklist->priority = $request->priority;
        }

        $tasklist->save();

        return response()->json([
            'message' => 'Task List updated successfully!',
            'taskList' => $tasklist,
        ]);
    }
}
