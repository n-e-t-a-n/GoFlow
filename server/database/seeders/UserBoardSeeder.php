<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\Board;

class UserBoardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $boards = Board::all();

        $boards->each(function ($board) use ($users) {
            $usersToAssign = $users->random(3);

            foreach ($usersToAssign as $user) {
                $role = rand(0, 1) ? 'admin' : 'member';

                if (!$board->users->contains($user->id)) {
                    $board->users()->attach($user->id, ['role' => $role]);
                }
            }
        });
    }
}
