<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Board;
use App\Models\TaskList;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TaskList>
 */
class TaskListFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'board_id' => $this->faker->numberBetween(1, 20),
            'name' => $this->faker->word,
            'position' => $this->faker->unique()->numberBetween(1, 100),
        ];
    }
}
