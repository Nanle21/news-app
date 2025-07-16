<?php

namespace App\Console\Commands;

use App\Models\DataSource;
use App\Services\NewsServiceFactory;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ScheduledNewsFetchCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'news:fetch-scheduled {--source= : Specific data source type to fetch from} {--limit=50 : Number of articles to fetch per source}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scheduled command to fetch news articles from external APIs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $sourceType = $this->option('source');
        $limit = (int) $this->option('limit');

        $this->info('Starting scheduled news fetch process...');

        // Get active data sources
        $query = DataSource::where('is_active', true);
        if ($sourceType) {
            $query->where('type', $sourceType);
        }
        
        $dataSources = $query->get();

        if ($dataSources->isEmpty()) {
            $this->error('No active data sources found.');
            Log::info('Scheduled news fetch: No active data sources found');
            return 1;
        }

        $totalArticles = 0;
        $successfulSources = 0;
        $failedSources = 0;

        foreach ($dataSources as $dataSource) {
            $this->info("Fetching from {$dataSource->name}...");

            try {
                // Check rate limiting
                if ($dataSource->isRateLimited()) {
                    $this->warn("Rate limited for {$dataSource->name}, skipping...");
                    Log::info("Scheduled news fetch: Rate limited for {$dataSource->name}");
                    continue;
                }

                // Create service instance
                $service = NewsServiceFactory::create($dataSource);

                // Fetch articles
                $articles = $service->fetchArticles(['pageSize' => $limit]);

                // Update data source
                $dataSource->updateLastFetched();
                $dataSource->increment('articles_count', count($articles));

                $this->info("✓ Fetched " . count($articles) . " articles from {$dataSource->name}");
                $totalArticles += count($articles);
                $successfulSources++;

                Log::info("Scheduled news fetch: Successfully fetched " . count($articles) . " articles from {$dataSource->name}");

            } catch (\Exception $e) {
                $this->error("✗ Error fetching from {$dataSource->name}: " . $e->getMessage());
                $failedSources++;
                
                Log::error("Scheduled news fetch error for {$dataSource->name}", [
                    'error' => $e->getMessage(),
                    'data_source' => $dataSource->toArray()
                ]);
            }
        }

        $this->info("Scheduled news fetch completed!");
        $this->info("Total articles fetched: {$totalArticles}");
        $this->info("Successful sources: {$successfulSources}");
        $this->info("Failed sources: {$failedSources}");

        Log::info("Scheduled news fetch completed", [
            'total_articles' => $totalArticles,
            'successful_sources' => $successfulSources,
            'failed_sources' => $failedSources
        ]);

        return 0;
    }
} 