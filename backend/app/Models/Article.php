<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'url',
        'image_url',
        'author',
        'published_at',
        'source_id',
        'category_id',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function source()
    {
        return $this->belongsTo(Source::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function scopeSearch($query, $keyword)
    {
        return $query->where(function ($q) use ($keyword) {
            $q->whereRaw('LOWER(title) LIKE ?', ['%' . strtolower($keyword) . '%'])
              ->orWhereRaw('LOWER(content) LIKE ?', ['%' . strtolower($keyword) . '%'])
              ->orWhereRaw('LOWER(author) LIKE ?', ['%' . strtolower($keyword) . '%']);
        });
    }

    public function scopeFilterByDate($query, $startDate = null, $endDate = null)
    {
        if ($startDate) {
            $query->whereDate('published_at', '>=', $startDate);
        }
        
        if ($endDate) {
            $query->whereDate('published_at', '<=', $endDate);
        }
        
        return $query;
    }

    public function scopeFilterByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeFilterBySource($query, $sourceId)
    {
        return $query->where('source_id', $sourceId);
    }

    public function scopeFilterByUserPreferences($query, $user)
    {
        $preferences = $user->getOrCreatePreferences();

        // Filter by preferred sources
        if (!$preferences->include_all_sources && !empty($preferences->preferred_sources)) {
            $query->whereIn('source_id', $preferences->preferred_sources);
        }

        // Filter by preferred categories
        if (!$preferences->include_all_categories && !empty($preferences->preferred_categories)) {
            $query->whereIn('category_id', $preferences->preferred_categories);
        }

        // Filter by preferred authors
        if (!$preferences->include_all_authors && !empty($preferences->preferred_authors)) {
            $query->whereIn('author', $preferences->preferred_authors);
        }

        return $query;
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function bookmarkedBy()
    {
        return $this->belongsToMany(User::class, 'bookmarks')->withTimestamps();
    }

    public function isBookmarkedBy($user)
    {
        if (!$user) return false;
        return $this->bookmarks()->where('user_id', $user->id)->exists();
    }
}
