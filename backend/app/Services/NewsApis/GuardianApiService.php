<?php

namespace App\Services\NewsApis;

use App\Models\DataSource;
use App\Models\Article;
use App\Models\Category;
use App\Models\Source;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GuardianApiService
{
    protected $dataSource;
    protected $apiKey;
    protected $baseUrl = 'https://content.guardianapis.com';

    public function __construct(DataSource $dataSource)
    {
        $this->dataSource = $dataSource;
        $this->apiKey = $dataSource->api_key;
    }

    public function fetchArticles($params = [])
    {
        try {
            $response = Http::get($this->baseUrl . '/search', array_merge([
                'api-key' => $this->apiKey,
                'show-fields' => 'headline,trailText,byline,thumbnail,lastModified',
                'show-tags' => 'contributor,series',
                'page-size' => 50,
                'order-by' => 'newest',
            ], $params));

            if ($response->successful()) {
                $data = $response->json();
                return $this->processArticles($data['response']['results'] ?? []);
            } else {
                Log::error('Guardian API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'data_source' => $this->dataSource->name
                ]);
                return [];
            }
        } catch (\Exception $e) {
            Log::error('Guardian API service error', [
                'error' => $e->getMessage(),
                'data_source' => $this->dataSource->name
            ]);
            return [];
        }
    }

    public function fetchSections()
    {
        try {
            $response = Http::get($this->baseUrl . '/sections', [
                'api-key' => $this->apiKey,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['response']['results'] ?? [];
            }
        } catch (\Exception $e) {
            Log::error('Guardian sections request failed', [
                'error' => $e->getMessage(),
                'data_source' => $this->dataSource->name
            ]);
        }

        return [];
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
                Log::error('Error processing Guardian article', [
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
            ['name' => 'The Guardian'],
            [
                'url' => 'https://www.theguardian.com',
                'description' => 'The Guardian - British daily newspaper',
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
        $existingArticle = Article::where('url', $article['webUrl'])->first();
        if ($existingArticle) {
            return null; // Skip duplicate
        }

        // Extract author from tags
        $author = 'Unknown Author';
        if (isset($article['tags']) && !empty($article['tags'])) {
            foreach ($article['tags'] as $tag) {
                if ($tag['type'] === 'contributor') {
                    $author = $tag['webTitle'];
                    break;
                }
            }
        }

        // Create article
        return Article::create([
            'title' => $article['webTitle'] ?? '',
            'content' => $article['fields']['trailText'] ?? $article['webTitle'] ?? '',
            'url' => $article['webUrl'] ?? '',
            'image_url' => $article['fields']['thumbnail'] ?? null,
            'author' => $author,
            'published_at' => $article['webPublicationDate'] ?? now(),
            'source_id' => $source->id,
            'category_id' => $category->id,
        ]);
    }

    protected function mapCategory($article)
    {
        // Map Guardian section IDs to our categories
        $categoryMappings = [
            'business' => 'Business',
            'technology' => 'Technology',
            'sport' => 'Sports',
            'world' => 'World',
            'politics' => 'Politics',
            'environment' => 'Environment',
            'science' => 'Science',
            'culture' => 'Entertainment',
            'lifeandstyle' => 'Lifestyle',
            'education' => 'Education',
        ];

        $sectionId = $article['sectionId'] ?? 'general';
        return $categoryMappings[$sectionId] ?? 'General';
    }
} 