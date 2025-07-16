<?php

namespace App\Console\Commands;

use App\Models\DataSource;
use App\Services\NewsServiceFactory;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class FetchNewsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'news:fetch {--source= : Specific data source type to fetch from} {--limit=50 : Number of articles to fetch per source}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch news articles from external APIs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $sourceType = $this->option('source');
        $limit = (int) $this->option('limit');

        $this->info('Starting news fetch process...');

        // Get active data sources
        $query = DataSource::where('is_active', true);
        if ($sourceType) {
            $query->where('type', $sourceType);
        }
        
        $dataSources = $query->get();

        if ($dataSources->isEmpty()) {
            $this->error('No active data sources found.');
            return 1;
        }

        $totalArticles = 0;

        foreach ($dataSources as $dataSource) {
            $this->info("Fetching from {$dataSource->name}...");

            try {
                // Check rate limiting
                if ($dataSource->isRateLimited()) {
                    $this->warn("Rate limited for {$dataSource->name}, skipping...");
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

            } catch (\Exception $e) {
                $this->error("✗ Error fetching from {$dataSource->name}: " . $e->getMessage());
                Log::error("News fetch error for {$dataSource->name}", [
                    'error' => $e->getMessage(),
                    'data_source' => $dataSource->toArray()
                ]);
            }
        }

        $this->info("News fetch completed! Total articles fetched: {$totalArticles}");
        return 0;
    }
}
