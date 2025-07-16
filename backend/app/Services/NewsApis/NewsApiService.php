<?php

namespace App\Services\NewsApis;

use App\Models\DataSource;
use App\Models\Article;
use App\Models\Category;
use App\Models\Source;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NewsApiService
{
    protected $dataSource;
    protected $apiKey;
    protected $baseUrl = 'https://newsapi.org/v2';

    public function __construct(DataSource $dataSource)
    {
        $this->dataSource = $dataSource;
        $this->apiKey = $dataSource->api_key;
    }

    public function fetchArticles($params = [])
    {
        try {
            $response = Http::get($this->baseUrl . '/top-headlines', array_merge([
                'apiKey' => $this->apiKey,
                'country' => 'us',
                'pageSize' => 100,
            ], $params));

            if ($response->successful()) {
                $data = $response->json();
                return $this->processArticles($data['articles'] ?? []);
            } else {
                Log::error('NewsAPI request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'data_source' => $this->dataSource->name
                ]);
                return [];
            }
        } catch (\Exception $e) {
            Log::error('NewsAPI service error', [
                'error' => $e->getMessage(),
                'data_source' => $this->dataSource->name
            ]);
            return [];
        }
    }

    public function fetchTopHeadlines($params = [])
    {
        try {
            $response = Http::get($this->baseUrl . '/top-headlines', array_merge([
                'apiKey' => $this->apiKey,
                'country' => 'us',
                'pageSize' => 100,
            ], $params));

            if ($response->successful()) {
                $data = $response->json();
                return $this->processArticles($data['articles'] ?? []);
            } else {
                Log::error('NewsAPI top headlines request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'data_source' => $this->dataSource->name
                ]);
                return [];
            }
        } catch (\Exception $e) {
            Log::error('NewsAPI top headlines service error', [
                'error' => $e->getMessage(),
                'data_source' => $this->dataSource->name
            ]);
            return [];
        }
    }

    protected function processArticles($articles)
    {
        $processedArticles = [];
        
        foreach ($articles as $article) {
            try {
                $processedArticle = $this->processArticle($article);
                if ($processedArticle) {
                    $processedArticles[] = $processedArticle;
                }
            } catch (\Exception $e) {
                Log::error('Error processing NewsAPI article', [
                    'error' => $e->getMessage(),
                    'article' => $article
                ]);
            }
        }

        return $processedArticles;
    }

    protected function processArticle($article)
    {
        // Get or create source
        $source = Source::firstOrCreate(
            ['name' => $article['source']['name'] ?? 'Unknown Source'],
            [
                'url' => $article['source']['id'] ?? null,
                'description' => 'Imported from NewsAPI',
                'is_active' => true,
            ]
        );

        // Get or create category (map from NewsAPI categories)
        $categoryName = $this->mapCategory($article);
        $category = Category::firstOrCreate(
            ['name' => $categoryName],
            ['description' => "Category for $categoryName articles"]
        );

        // Check if article already exists
        $existingArticle = Article::where('url', $article['url'])->first();
        if ($existingArticle) {
            return null; // Skip duplicate
        }

        // Create article
        return Article::create([
            'title' => $article['title'] ?? '',
            'content' => $article['description'] ?? $article['content'] ?? '',
            'url' => $article['url'] ?? '',
            'image_url' => $article['urlToImage'] ?? null,
            'author' => $article['author'] ?? 'Unknown Author',
            'published_at' => $article['publishedAt'] ?? now(),
            'source_id' => $source->id,
            'category_id' => $category->id,
        ]);
    }

    protected function mapCategory($article)
    {
        // Map NewsAPI categories to our categories
        $categoryMappings = [
            'business' => 'Business',
            'entertainment' => 'Entertainment',
            'general' => 'General',
            'health' => 'Health',
            'science' => 'Science',
            'sports' => 'Sports',
            'technology' => 'Technology',
        ];

        // Try to extract category from various sources
        $category = $article['category'] ?? 
                   $article['source']['category'] ?? 
                   'general';

        return $categoryMappings[$category] ?? 'General';
    }
} 