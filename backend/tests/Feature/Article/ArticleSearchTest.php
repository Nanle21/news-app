<?php

namespace Tests\Feature\Article;

use App\Models\Article;
use App\Models\Category;
use App\Models\Source;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\ClientRepository;
use Tests\TestCase;

class ArticleSearchTest extends TestCase
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

        // Create test data
        $this->category = Category::factory()->create(['name' => 'Technology']);
        $this->source = Source::factory()->create(['name' => 'Tech News']);
        
        // Create test articles
        Article::factory()->create([
            'title' => 'Laravel Framework Best Practices',
            'content' => 'Laravel is a powerful PHP framework for web development.',
            'author' => 'John Doe',
            'category_id' => $this->category->id,
            'source_id' => $this->source->id,
            'published_at' => now()->subDays(1),
        ]);

        Article::factory()->create([
            'title' => 'React Development Tips',
            'content' => 'React is a popular JavaScript library for building user interfaces.',
            'author' => 'Jane Smith',
            'category_id' => $this->category->id,
            'source_id' => $this->source->id,
            'published_at' => now()->subDays(2),
        ]);

        Article::factory()->create([
            'title' => 'Docker Containerization Guide',
            'content' => 'Docker helps developers build and deploy applications easily.',
            'author' => 'Mike Johnson',
            'category_id' => $this->category->id,
            'source_id' => $this->source->id,
            'published_at' => now()->subDays(3),
        ]);
    }

    public function test_user_can_search_articles_by_keyword(): void
    {
        $response = $this->getJson('/api/articles/search?q=laravel');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'content',
                        'author',
                        'published_at',
                        'source' => ['id', 'name'],
                        'category' => ['id', 'name'],
                    ]
                ],
                'total',
                'per_page',
                'current_page',
                'last_page',
            ]);

        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.title', 'Laravel Framework Best Practices');
    }

    public function test_user_can_search_articles_by_author(): void
    {
        $response = $this->getJson('/api/articles/search?q=john');

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
        
        // Check that both John Doe and Mike Johnson are returned
        $authors = collect($response->json('data'))->pluck('author')->toArray();
        $this->assertContains('John Doe', $authors);
        $this->assertContains('Mike Johnson', $authors);
    }

    public function test_user_can_search_articles_by_content(): void
    {
        $response = $this->getJson('/api/articles/search?q=javascript');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.title', 'React Development Tips');
    }

    public function test_search_returns_empty_when_no_matches(): void
    {
        $response = $this->getJson('/api/articles/search?q=nonexistent');

        $response->assertStatus(200);
        $response->assertJsonCount(0, 'data');
        $response->assertJsonPath('total', 0);
    }

    public function test_search_is_case_insensitive(): void
    {
        $response = $this->getJson('/api/articles/search?q=LARAVEL');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.title', 'Laravel Framework Best Practices');
    }

    public function test_search_without_keyword_returns_all_articles(): void
    {
        $response = $this->getJson('/api/articles/search');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    public function test_search_supports_partial_matching(): void
    {
        $response = $this->getJson('/api/articles/search?q=react');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.title', 'React Development Tips');
    }
} 