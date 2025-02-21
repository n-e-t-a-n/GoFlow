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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function board()
    {
        return $this->belongsTo(Board::class);
    }

}
