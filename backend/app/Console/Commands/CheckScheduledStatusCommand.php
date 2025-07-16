<?php

namespace App\Console\Commands;

use App\Models\DataSource;
use App\Models\Article;
use Illuminate\Console\Command;

class CheckScheduledStatusCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'news:status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check the status of scheduled news fetching and data sources';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== News Aggregator System Status ===');
        
        // Check data sources
        $this->checkDataSources();
        
        // Check articles
        $this->checkArticles();
        
        // Check scheduled tasks
        $this->checkScheduledTasks();
        
        $this->info('=== Status Check Complete ===');
        
        return 0;
    }

    private function checkDataSources()
    {
        $this->info("\n📰 Data Sources Status:");
        
        $dataSources = DataSource::all();
        
        if ($dataSources->isEmpty()) {
            $this->error('No data sources found.');
            return;
        }

        $table = [];
        foreach ($dataSources as $source) {
            $status = $source->is_active ? '✅ Active' : '❌ Inactive';
            $lastFetch = $source->last_fetched_at ? $source->last_fetched_at->diffForHumans() : 'Never';
            $rateLimited = $source->isRateLimited() ? '⏰ Rate Limited' : '🟢 Available';
            
            $table[] = [
                $source->name,
                $source->type,
                $status,
                $lastFetch,
                $rateLimited,
                $source->articles_count ?? 0
            ];
        }

        $this->table(
            ['Name', 'Type', 'Status', 'Last Fetch', 'Rate Status', 'Articles'],
            $table
        );
    }

    private function checkArticles()
    {
        $this->info("\n📄 Articles Status:");
        
        $totalArticles = Article::count();
        $recentArticles = Article::where('published_at', '>=', now()->subDay())->count();
        $oldestArticle = Article::orderBy('published_at')->first();
        $newestArticle = Article::orderBy('published_at', 'desc')->first();
        
        $this->info("Total articles in database: {$totalArticles}");
        $this->info("Articles from last 24 hours: {$recentArticles}");
        
        if ($oldestArticle) {
            $this->info("Oldest article: {$oldestArticle->title} ({$oldestArticle->published_at->diffForHumans()})");
        }
        
        if ($newestArticle) {
            $this->info("Newest article: {$newestArticle->title} ({$newestArticle->published_at->diffForHumans()})");
        }

        // Articles by source
        $this->info("\nArticles by source:");
        $sources = \App\Models\Source::withCount('articles')->orderBy('articles_count', 'desc')->get();
        
        foreach ($sources as $source) {
            $this->info("  - {$source->name}: {$source->articles_count} articles");
        }
    }

    private function checkScheduledTasks()
    {
        $this->info("\n⏰ Scheduled Tasks Status:");
        
        $this->info("Scheduled commands configured:");
        $this->info("  - news:fetch-scheduled --limit=25 (every hour)");
        $this->info("  - news:fetch-scheduled --limit=50 (every 4 hours)");
        $this->info("  - log:clear (weekly)");
        
        // Check if log file exists
        $logFile = storage_path('logs/scheduled-news-fetch.log');
        if (file_exists($logFile)) {
            $logSize = filesize($logFile);
            $this->info("Scheduled fetch log file: " . number_format($logSize) . " bytes");
        } else {
            $this->warn("Scheduled fetch log file not found (may not have run yet)");
        }
        
        // Check Laravel log for recent scheduled activity
        $laravelLog = storage_path('logs/laravel.log');
        if (file_exists($laravelLog)) {
            $recentLogs = file_get_contents($laravelLog);
            if (strpos($recentLogs, 'Scheduled news fetch') !== false) {
                $this->info("✅ Recent scheduled fetch activity found in logs");
            } else {
                $this->warn("⚠️  No recent scheduled fetch activity in logs");
            }
        }
    }
} 