<?php

namespace Tests\Feature\Article;

use App\Models\Category;
use App\Models\Source;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\ClientRepository;
use Tests\TestCase;

class ArticleFilterOptionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create Passport clients for testing
        $clientRepository = new ClientRepository();
        $clientRepository->createPersonalAccessClient(
            null,
            'Test Personal Access Client',
            'http://localhost'
        );

        // Create and authenticate a test user
        $this->user = \App\Models\User::factory()->create();
        $this->actingAs($this->user, 'api');

        // Create test categories
        Category::factory()->create(['name' => 'Technology']);
        Category::factory()->create(['name' => 'Sports']);
        Category::factory()->create(['name' => 'Politics']);
        
        // Create test sources
        Source::factory()->create(['name' => 'Tech News', 'is_active' => true]);
        Source::factory()->create(['name' => 'Sports Daily', 'is_active' => true]);
        Source::factory()->create(['name' => 'Inactive Source', 'is_active' => false]);
    }

    public function test_user_can_get_categories(): void
    {
        $response = $this->getJson('/api/articles/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'description',
                        'created_at',
                        'updated_at',
                    ]
                ]
            ]);

        $response->assertJsonCount(3, 'data');
        
        // Check that categories are ordered by name
        $categories = $response->json('data');
        $this->assertEquals('Politics', $categories[0]['name']);
        $this->assertEquals('Sports', $categories[1]['name']);
        $this->assertEquals('Technology', $categories[2]['name']);
    }

    public function test_user_can_get_active_sources(): void
    {
        $response = $this->getJson('/api/articles/sources');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'url',
                        'description',
                        'is_active',
                        'created_at',
                        'updated_at',
                    ]
                ]
            ]);

        $response->assertJsonCount(2, 'data');
        
        // Check that only active sources are returned
        $sources = $response->json('data');
        $sourceNames = collect($sources)->pluck('name')->toArray();
        $this->assertContains('Tech News', $sourceNames);
        $this->assertContains('Sports Daily', $sourceNames);
        $this->assertNotContains('Inactive Source', $sourceNames);
    }
} 