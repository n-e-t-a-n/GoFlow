<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\TaskList;
use App\Models\Task;
use App\Models\User;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TaskList::all()->each(function ($list) {
            Task::factory(3)->create([
                'board_id' => $list->board_id,
                'task_list_id' => $list->id,
                'assigned_user_id' => User::inRandomOrder()->first()->id,
            ]);
        });
    }
}
