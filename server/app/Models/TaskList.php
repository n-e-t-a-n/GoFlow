<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskList extends Model
{
    /** @use HasFactory<\Database\Factories\TaskListFactory> */
    use HasFactory;

    protected $fillable = ['board_id', 'name', 'position'];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function board()
    {
        return $this->belongsTo(Board::class);
    }
}
