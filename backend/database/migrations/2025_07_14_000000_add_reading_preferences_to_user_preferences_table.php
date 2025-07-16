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
        Schema::table('user_preferences', function (Blueprint $table) {
            $table->enum('reading_speed', ['slow', 'normal', 'fast'])->default('normal')->after('include_all_authors');
            $table->enum('font_size', ['small', 'medium', 'large'])->default('medium')->after('reading_speed');
            $table->integer('auto_refresh_interval')->default(30)->comment('in minutes')->after('font_size');
            $table->boolean('show_summaries')->default(true)->after('auto_refresh_interval');
            $table->boolean('dark_mode_preferred')->default(false)->after('show_summaries');
            $table->json('notification_preferences')->nullable()->after('dark_mode_preferred');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_preferences', function (Blueprint $table) {
            $table->dropColumn([
                'reading_speed',
                'font_size', 
                'auto_refresh_interval',
                'show_summaries',
                'dark_mode_preferred',
                'notification_preferences'
            ]);
        });
    }
}; 