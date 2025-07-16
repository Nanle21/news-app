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
        Schema::table('articles', function (Blueprint $table) {
            // Add indexes for better local data filtering performance
            $table->index(['published_at', 'source_id'], 'articles_published_source_idx');
            $table->index(['published_at', 'category_id'], 'articles_published_category_idx');
            $table->index(['title'], 'articles_title_idx');
            $table->index(['author'], 'articles_author_idx');
            $table->index(['url'], 'articles_url_unique_idx');
        });
        
        // Add index for content (TEXT) column with key length for MySQL
        \DB::statement('CREATE INDEX articles_content_idx ON articles (content(191))');

        Schema::table('sources', function (Blueprint $table) {
            $table->index(['is_active'], 'sources_active_idx');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->index(['name'], 'categories_name_idx');
        });

        Schema::table('data_sources', function (Blueprint $table) {
            $table->index(['is_active', 'last_fetched_at'], 'data_sources_active_fetch_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex('articles_published_source_idx');
            $table->dropIndex('articles_published_category_idx');
            $table->dropIndex('articles_title_idx');
            $table->dropIndex('articles_author_idx');
            $table->dropIndex('articles_url_unique_idx');
        });
        
        // Drop the raw content index
        \DB::statement('DROP INDEX IF EXISTS articles_content_idx ON articles');

        Schema::table('sources', function (Blueprint $table) {
            $table->dropIndex('sources_active_idx');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('categories_name_idx');
        });

        Schema::table('data_sources', function (Blueprint $table) {
            $table->dropIndex('data_sources_active_fetch_idx');
        });
    }
}; 