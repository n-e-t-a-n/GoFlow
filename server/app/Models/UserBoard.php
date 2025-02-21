<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBoard extends Model
{
    /** @use HasFactory<\Database\Factories\UserBoardFactory> */
    use HasFactory;

    protected $table = 'user_boards';

    protected $fillable = ['user_id', 'board_id', 'role'];
}
