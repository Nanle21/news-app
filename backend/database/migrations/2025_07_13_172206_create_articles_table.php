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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('url')->nullable();
            $table->string('image_url')->nullable();
            $table->string('author')->nullable();
            $table->timestamp('published_at');
            $table->foreignId('source_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            // Add indexes for better search performance
            $table->index('title');
            $table->index('published_at');
            $table->index(['source_id', 'category_id']);
        });
        // Add index for content (TEXT) column with key length
        if (Schema::getConnection()->getDriverName() === 'mysql') {
        \DB::statement('CREATE INDEX articles_content_index ON articles (content(191))');
        } else {
            // SQLite and others: no length
            \DB::statement('CREATE INDEX articles_content_index ON articles (content)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
