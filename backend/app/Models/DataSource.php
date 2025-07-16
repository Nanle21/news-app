<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataSource extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'base_url',
        'api_key',
        'config',
        'is_active',
        'rate_limit_per_hour',
        'last_fetched_at',
        'articles_count',
    ];

    protected $casts = [
        'config' => 'array',
        'is_active' => 'boolean',
        'last_fetched_at' => 'datetime',
    ];

    public function articles()
    {
        return $this->hasMany(Article::class, 'source_id');
    }

    public function getConfigValue($key, $default = null)
    {
        return data_get($this->config, $key, $default);
    }

    public function setConfigValue($key, $value)
    {
        $config = $this->config ?? [];
        data_set($config, $key, $value);
        $this->config = $config;
        return $this;
    }

    public function isRateLimited()
    {
        if (!$this->last_fetched_at) {
            return false;
        }

        // Simple rate limiting - can be enhanced with Redis/cache
        $lastHour = now()->subHour();
        return $this->last_fetched_at->isAfter($lastHour);
    }

    public function updateLastFetched()
    {
        $this->update(['last_fetched_at' => now()]);
    }
}
