<?php

namespace App\Services\NewsApis;

use App\Models\DataSource;
use App\Models\Article;
use App\Models\Category;
use App\Models\Source;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BbcApiService
{
    protected $dataSource;
    protected $apiKey;
    protected $baseUrl = 'https://newsapi.org/v2'; // BBC uses NewsAPI

    public function __construct(DataSource $dataSource)
    {
        $this->dataSource = $dataSource;
        $this->apiKey = $dataSource->api_key;
    }

    public function fetchArticles($params = [])
    {
        try {
            $response = Http::get($this->baseUrl . '/everything', array_merge([
                'apiKey' => $this->apiKey,
                'domains' => 'bbc.co.uk,bbc.com',
                'language' => 'en',
                'sortBy' => 'publishedAt',
                'pageSize' => 100,
            ], $params));

            if ($response->successful()) {
                $data = $response->json();
                return $this->processArticles($data['articles'] ?? []);
            } else {
                Log::error('BBC API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'data_source' => $this->dataSource->name
                ]);
                return [];
            }
        } catch (\Exception $e) {
            Log::error('BBC API service error', [
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
                'sources' => 'bbc-news',
                'pageSize' => 100,
            ], $params));

            if ($response->successful()) {
                $data = $response->json();
                return $this->processArticles($data['articles'] ?? []);
            } else {
                Log::error('BBC top headlines request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'data_source' => $this->dataSource->name
                ]);
                return [];
            }
        } catch (\Exception $e) {
            Log::error('BBC top headlines service error', [
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
                Log::error('Error processing BBC article', [
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
            ['name' => 'BBC News'],
            [
                'url' => 'https://www.bbc.com/news',
                'description' => 'BBC News - British Broadcasting Corporation',
                'is_active' => true,
            ]
        );

        // Get or create category
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
            'author' => $article['author'] ?? 'BBC News',
            'published_at' => $article['publishedAt'] ?? now(),
            'source_id' => $source->id,
            'category_id' => $category->id,
        ]);
    }

    protected function mapCategory($article)
    {
        // Map BBC categories to our categories
        $categoryMappings = [
            'business' => 'Business',
            'entertainment' => 'Entertainment',
            'general' => 'General',
            'health' => 'Health',
            'science' => 'Science',
            'sports' => 'Sports',
            'technology' => 'Technology',
            'world' => 'World',
            'politics' => 'Politics',
        ];

        // Try to extract category from various sources
        $category = $article['category'] ?? 
                   $article['source']['category'] ?? 
                   'general';

        return $categoryMappings[$category] ?? 'General';
    }
} 