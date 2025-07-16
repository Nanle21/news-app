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
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->json('preferred_sources')->nullable(); // Array of source IDs
            $table->json('preferred_categories')->nullable(); // Array of category IDs
            $table->json('preferred_authors')->nullable(); // Array of author names
            $table->boolean('include_all_sources')->default(true);
            $table->boolean('include_all_categories')->default(true);
            $table->boolean('include_all_authors')->default(true);
            $table->timestamps();
            
            // Ensure one preference record per user
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};
