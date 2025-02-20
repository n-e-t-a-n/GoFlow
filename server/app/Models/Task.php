<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;

    protected $fillable = ['board_id', 'task_list_id', 'title', 'description', 'status', 'assigned_user_id', 'due_date', 'priority'];

    public function taskList()
    {
        return $this->belongsTo(TaskList::class);
    }

    public function board()
    {
        return $this->belongsTo(Board::class);
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }
}
