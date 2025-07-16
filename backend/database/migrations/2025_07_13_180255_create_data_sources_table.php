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
        Schema::create('data_sources', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "NewsAPI", "The Guardian", "BBC News"
            $table->string('type'); // e.g., "newsapi", "guardian", "bbc", "nyt"
            $table->string('base_url');
            $table->string('api_key')->nullable();
            $table->json('config')->nullable(); // Additional configuration
            $table->boolean('is_active')->default(true);
            $table->integer('rate_limit_per_hour')->default(1000);
            $table->timestamp('last_fetched_at')->nullable();
            $table->integer('articles_count')->default(0);
            $table->timestamps();
            
            $table->unique('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_sources');
    }
};
