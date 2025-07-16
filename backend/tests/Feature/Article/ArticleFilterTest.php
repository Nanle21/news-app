<?php

namespace Tests\Feature\Article;

use App\Models\Article;
use App\Models\Category;
use App\Models\Source;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\ClientRepository;
use Tests\TestCase;

class ArticleFilterTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create Passport clients for testing
        $clientRepository = new \Laravel\Passport\ClientRepository();
        $clientRepository->createPersonalAccessClient(
            null,
            'Test Personal Access Client',
            'http://localhost'
        );

        // Create and authenticate a test user
        $this->user = \App\Models\User::factory()->create();
        $this->actingAs($this->user, 'api');

        // Create test categories
        $this->techCategory = Category::factory()->create(['name' => 'Technology']);
        $this->sportsCategory = Category::factory()->create(['name' => 'Sports']);
        
        // Create test sources
        $this->techSource = Source::factory()->create(['name' => 'Tech News']);
        $this->sportsSource = Source::factory()->create(['name' => 'Sports Daily']);
        
        // Create test articles with different dates, categories, and sources
        Article::factory()->create([
            'title' => 'Latest Tech News',
            'content' => 'Breaking technology updates.',
            'category_id' => $this->techCategory->id,
            'source_id' => $this->techSource->id,
            'published_at' => now()->subDays(1),
        ]);

        Article::factory()->create([
            'title' => 'Old Tech Article',
            'content' => 'Previous technology news.',
            'category_id' => $this->techCategory->id,
            'source_id' => $this->techSource->id,
            'published_at' => now()->subDays(10),
        ]);

        Article::factory()->create([
            'title' => 'Sports Update',
            'content' => 'Latest sports news.',
            'category_id' => $this->sportsCategory->id,
            'source_id' => $this->sportsSource->id,
            'published_at' => now()->subDays(2),
        ]);

        Article::factory()->create([
            'title' => 'Old Sports Article',
            'content' => 'Previous sports news.',
            'category_id' => $this->sportsCategory->id,
            'source_id' => $this->sportsSource->id,
            'published_at' => now()->subDays(15),
        ]);
    }

    public function test_user_can_filter_articles_by_date_range(): void
    {
        $startDate = now()->subDays(5)->format('Y-m-d');
        $endDate = now()->subDays(1)->format('Y-m-d');

        $response = $this->getJson("/api/articles/search?start_date={$startDate}&end_date={$endDate}");

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
        
        // Should return articles published between 5 days ago and 1 day ago
        $titles = collect($response->json('data'))->pluck('title')->toArray();
        $this->assertContains('Latest Tech News', $titles);
        $this->assertContains('Sports Update', $titles);
        $this->assertNotContains('Old Tech Article', $titles);
        $this->assertNotContains('Old Sports Article', $titles);
    }

    public function test_user_can_filter_articles_by_start_date_only(): void
    {
        $startDate = now()->subDays(5)->format('Y-m-d');

        $response = $this->getJson("/api/articles/search?start_date={$startDate}");

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
        
        // Should return articles published after 5 days ago
        $titles = collect($response->json('data'))->pluck('title')->toArray();
        $this->assertContains('Latest Tech News', $titles);
        $this->assertContains('Sports Update', $titles);
    }

    public function test_user_can_filter_articles_by_end_date_only(): void
    {
        $endDate = now()->subDays(5)->format('Y-m-d');

        $response = $this->getJson("/api/articles/search?end_date={$endDate}");

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
        
        // Should return articles published before 5 days ago
        $titles = collect($response->json('data'))->pluck('title')->toArray();
        $this->assertContains('Old Tech Article', $titles);
        $this->assertContains('Old Sports Article', $titles);
    }

    public function test_user_can_filter_articles_by_category(): void
    {
        $response = $this->getJson("/api/articles/search?category_id={$this->techCategory->id}");

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
        
        // Should return only technology articles
        $titles = collect($response->json('data'))->pluck('title')->toArray();
        $this->assertContains('Latest Tech News', $titles);
        $this->assertContains('Old Tech Article', $titles);
        $this->assertNotContains('Sports Update', $titles);
        $this->assertNotContains('Old Sports Article', $titles);
    }

    public function test_user_can_filter_articles_by_source(): void
    {
        $response = $this->getJson("/api/articles/search?source_id={$this->sportsSource->id}");

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
        
        // Should return only sports source articles
        $titles = collect($response->json('data'))->pluck('title')->toArray();
        $this->assertContains('Sports Update', $titles);
        $this->assertContains('Old Sports Article', $titles);
        $this->assertNotContains('Latest Tech News', $titles);
        $this->assertNotContains('Old Tech Article', $titles);
    }

    public function test_user_can_combine_multiple_filters(): void
    {
        $startDate = now()->subDays(5)->format('Y-m-d');
        $endDate = now()->subDays(1)->format('Y-m-d');

        $response = $this->getJson("/api/articles/search?start_date={$startDate}&end_date={$endDate}&category_id={$this->techCategory->id}");

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        
        // Should return only technology articles within the date range
        $response->assertJsonPath('data.0.title', 'Latest Tech News');
    }

    public function test_user_can_filter_by_search_and_date(): void
    {
        $startDate = now()->subDays(5)->format('Y-m-d');
        $endDate = now()->subDays(1)->format('Y-m-d');

        $response = $this->getJson("/api/articles/search?q=tech&start_date={$startDate}&end_date={$endDate}");

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        
        // Should return only tech articles within the date range
        $response->assertJsonPath('data.0.title', 'Latest Tech News');
    }

    public function test_filter_by_nonexistent_category_returns_empty(): void
    {
        $response = $this->getJson('/api/articles/search?category_id=999');

        $response->assertStatus(200);
        $response->assertJsonCount(0, 'data');
    }

    public function test_filter_by_nonexistent_source_returns_empty(): void
    {
        $response = $this->getJson('/api/articles/search?source_id=999');

        $response->assertStatus(200);
        $response->assertJsonCount(0, 'data');
    }

    public function test_invalid_date_format_returns_error(): void
    {
        $response = $this->getJson('/api/articles/search?start_date=invalid-date');

        $response->assertStatus(422);
    }

    public function test_articles_are_ordered_by_published_at_desc(): void
    {
        $response = $this->getJson('/api/articles/search');

        $response->assertStatus(200);
        $response->assertJsonCount(4, 'data');
        
        // Check that articles are ordered by published_at desc (newest first)
        $articles = $response->json('data');
        $this->assertTrue(
            strtotime($articles[0]['published_at']) >= strtotime($articles[1]['published_at'])
        );
    }
} 