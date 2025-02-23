<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Task;
use App\Models\TaskList;
use App\Models\UserBoard;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;

class TaskController extends Controller
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

    public function index($boardId)
    {
        $userBoard = UserBoard::where('user_id', Auth::id())
                            ->where('board_id', $boardId)
                            ->first();

        if (!$userBoard) {
            return response()->json(['message' => 'You are not authorized to view tasks for this board.'], 403);
        }

        $tasks = Task::where('board_id', $boardId)
                    ->with('taskList') 
                    ->get();

        $lists = TaskList::where('board_id', $boardId)->get();

        return response()->json([
            'tasks' => $tasks,
            'lists' => $lists,
            'isAdmin' => $this->isAdmin($boardId),
        ]);
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'board_id' => 'required|exists:boards,id',
            'task_list_id' => 'required|exists:task_lists,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_user_id' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
            'priority' => 'nullable|in:low,medium,high,top',
            'status' => 'nullable|in:pending,in_progress,completed,on_hold',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        if (!$this->isMember($validatedData['board_id'])) {
            return response()->json(['message' => 'You are not authorized to create tasks for this board.'], 403);
        }

        if (!$this->isAdmin($validatedData['board_id'])) {
            $validatedData['due_date'] = null;
            $validatedData['priority'] = null;
            $validatedData['status'] = null;
        }

        $task = Task::create([
            'board_id' => $validatedData['board_id'],
            'task_list_id' => $validatedData['task_list_id'],
            'title' => $validatedData['title'],
            'description' => $validatedData['description'] ?? null,
            'assigned_user_id' => $validatedData['assigned_user_id'] ?? null,
            'due_date' => $validatedData['due_date'] ?? null,
            'priority' => $validatedData['priority'] ?? 'medium',
            'status' => $validatedData['status'] ?? 'pending',
        ]);

        return response()->json($task, 201);
    }

    public function edit(Request $request, $taskId)
    {
        $task = Task::findOrFail($taskId);

        if (!$this->isMember($task->board_id)) {
            return response()->json(['message' => 'You are not authorized to edit this task.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        $task->update($validatedData);

        return response()->json($task);
    }

    public function move(Request $request, $taskId)
    {
        $task = Task::findOrFail($taskId);

        if (!$this->isMember($task->board_id)) {
            return response()->json(['message' => 'You are not authorized to move this task.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'task_list_id' => 'required|exists:task_lists,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        $task->update([
            'task_list_id' => $validatedData['task_list_id'],
        ]);

        return response()->json($task);
    }

    public function setAssignee(Request $request, $taskId)
    {
        $task = Task::findOrFail($taskId);

        if (!$this->isAdmin($task->board_id)) {
            return response()->json(['message' => 'You are not authorized to assign users to this task.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'assigned_user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        $task->update([
            'assigned_user_id' => $validatedData['assigned_user_id'],
        ]);

        return response()->json($task);
    }

    public function setStatus(Request $request, $taskId)
    {
        $task = Task::findOrFail($taskId);

        if (!$this->isMember($task->board_id)) {
            return response()->json(['message' => 'You are not authorized to change the status of this task.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,in_progress,completed,on_hold',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        $task->update([
            'status' => $validatedData['status'],
        ]);

        return response()->json($task);
    }

    public function setDueDate(Request $request, $taskId)
    {
        $task = Task::findOrFail($taskId);

        if (!$this->isAdmin($task->board_id)) {
            return response()->json(['message' => 'You are not authorized to set the due date for this task.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'due_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        $task->update([
            'due_date' => $validatedData['due_date'],
        ]);

        return response()->json($task);
    }

    public function setPriority(Request $request, $taskId)
    {
        $task = Task::findOrFail($taskId);

        if (!$this->isAdmin($task->board_id)) {
            return response()->json(['message' => 'You are not authorized to change the priority of this task.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'priority' => 'required|in:low,medium,high,top',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        $task->update([
            'priority' => $validatedData['priority'],
        ]);

        return response()->json($task);
    }
}
