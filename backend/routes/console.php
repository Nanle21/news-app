<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Register scheduled commands
Schedule::command('news:fetch-scheduled --limit=25')
    ->hourly()
    ->withoutOverlapping()
    ->runInBackground()
    ->appendOutputTo(storage_path('logs/scheduled-news-fetch.log'));

Schedule::command('news:fetch-scheduled --limit=50')
    ->everyFourHours()
    ->withoutOverlapping()
    ->runInBackground()
    ->appendOutputTo(storage_path('logs/scheduled-news-fetch.log'));

Schedule::command('log:clear')
    ->weekly()
    ->runInBackground();
