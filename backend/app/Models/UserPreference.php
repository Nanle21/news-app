<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'preferred_sources',
        'preferred_categories',
        'preferred_authors',
        'include_all_sources',
        'include_all_categories',
        'include_all_authors',
        'reading_speed',
        'font_size',
        'auto_refresh_interval',
        'show_summaries',
        'dark_mode_preferred',
        'notification_preferences',
    ];

    protected $casts = [
        'preferred_sources' => 'array',
        'preferred_categories' => 'array',
        'preferred_authors' => 'array',
        'include_all_sources' => 'boolean',
        'include_all_categories' => 'boolean',
        'include_all_authors' => 'boolean',
        'reading_speed' => 'string',
        'font_size' => 'string',
        'auto_refresh_interval' => 'integer',
        'show_summaries' => 'boolean',
        'dark_mode_preferred' => 'boolean',
        'notification_preferences' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sources()
    {
        return $this->belongsToMany(Source::class, null, null, null, 'preferred_sources');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, null, null, null, 'preferred_categories');
    }
}
