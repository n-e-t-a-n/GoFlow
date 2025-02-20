<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('board_id')->constrained('boards')->onDelete('cascade');
            $table->foreignId('list_id')->constrained('lists')->onDelete('cascade');
            
            $table->string('title');
            $table->text('description')->nullable();

            $table->enum('status', ['pending', 'in_progress', 'completed', 'on_hold'])->default('pending');
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->onDelete('set null');
            
            $table->dateTime('due_date')->nullable();

            $table->enum('priority', ['low', 'medium', 'high', 'top']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
