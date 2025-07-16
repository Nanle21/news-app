<?php

namespace Tests\Feature;

use App\Models\DataSource;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\ClientRepository;
use Laravel\Passport\Passport;
use Tests\TestCase;

class DataSourceTest extends TestCase
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

        // Create test user
        $this->user = User::factory()->create();
    }

    public function test_user_can_get_data_sources(): void
    {
        Passport::actingAs($this->user);

        // Create test data source
        DataSource::create([
            'name' => 'Test News API',
            'type' => 'newsapi',
            'base_url' => 'https://newsapi.org/v2',
            'api_key' => 'test-key',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/data-sources');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'type',
                        'base_url',
                        'is_active',
                        'rate_limit_per_hour',
                        'last_fetched_at',
                        'articles_count',
                    ]
                ]
            ]);
    }

    public function test_user_can_create_data_source(): void
    {
        Passport::actingAs($this->user);

        $dataSourceData = [
            'name' => 'New News API',
            'type' => 'custom',
            'base_url' => 'https://api.example.com',
            'api_key' => 'test-api-key',
            'is_active' => true,
            'rate_limit_per_hour' => 500,
        ];

        $response = $this->postJson('/api/data-sources', $dataSourceData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data_source' => [
                    'id',
                    'name',
                    'type',
                    'base_url',
                    'is_active',
                ]
            ]);

        $this->assertDatabaseHas('data_sources', [
            'name' => 'New News API',
            'type' => 'custom',
        ]);
    }

    public function test_user_cannot_create_duplicate_data_source_type(): void
    {
        Passport::actingAs($this->user);

        // Create first data source
        DataSource::create([
            'name' => 'First API',
            'type' => 'newsapi',
            'base_url' => 'https://api1.example.com',
            'is_active' => true,
        ]);

        // Try to create second with same type
        $dataSourceData = [
            'name' => 'Second API',
            'type' => 'newsapi', // Same type
            'base_url' => 'https://api2.example.com',
            'is_active' => true,
        ];

        $response = $this->postJson('/api/data-sources', $dataSourceData);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'errors' => [
                    'type'
                ]
            ]);
    }

    public function test_user_can_update_data_source(): void
    {
        Passport::actingAs($this->user);

        $dataSource = DataSource::create([
            'name' => 'Original Name',
            'type' => 'newsapi',
            'base_url' => 'https://api.example.com',
            'is_active' => true,
        ]);

        $updateData = [
            'name' => 'Updated Name',
            'is_active' => false,
        ];

        $response = $this->putJson("/api/data-sources/{$dataSource->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data_source' => [
                    'id',
                    'name',
                    'type',
                    'is_active',
                ]
            ]);

        $this->assertDatabaseHas('data_sources', [
            'id' => $dataSource->id,
            'name' => 'Updated Name',
            'is_active' => false,
        ]);
    }

    public function test_user_can_delete_data_source(): void
    {
        Passport::actingAs($this->user);

        $dataSource = DataSource::create([
            'name' => 'Test API',
            'type' => 'newsapi',
            'base_url' => 'https://api.example.com',
            'is_active' => true,
        ]);

        $response = $this->deleteJson("/api/data-sources/{$dataSource->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message'
            ]);

        $this->assertDatabaseMissing('data_sources', [
            'id' => $dataSource->id,
        ]);
    }

    public function test_user_can_test_data_source(): void
    {
        Passport::actingAs($this->user);

        $dataSource = DataSource::create([
            'name' => 'Test API',
            'type' => 'newsapi',
            'base_url' => 'https://newsapi.org/v2',
            'api_key' => 'test-key',
            'is_active' => true,
        ]);

        $response = $this->postJson("/api/data-sources/{$dataSource->id}/test");

        // Should return success with 0 articles due to invalid API key
        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'articles_fetched',
                'data_source'
            ]);

        $response->assertJsonPath('articles_fetched', 0);
    }

    public function test_user_can_fetch_articles_from_data_source(): void
    {
        Passport::actingAs($this->user);

        $dataSource = DataSource::create([
            'name' => 'Test API',
            'type' => 'newsapi',
            'base_url' => 'https://newsapi.org/v2',
            'api_key' => 'test-key',
            'is_active' => true,
        ]);

        $response = $this->postJson("/api/data-sources/{$dataSource->id}/fetch");

        // Should return success with 0 articles due to invalid API key
        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'articles_fetched',
                'data_source'
            ]);

        $response->assertJsonPath('articles_fetched', 0);
    }

    public function test_unauthenticated_user_cannot_access_data_sources(): void
    {
        $response = $this->getJson('/api/data-sources');
        $response->assertStatus(401);

        $response = $this->postJson('/api/data-sources', []);
        $response->assertStatus(401);
    }

    public function test_data_source_validation(): void
    {
        Passport::actingAs($this->user);

        $response = $this->postJson('/api/data-sources', [
            'name' => '', // Invalid
            'type' => '', // Invalid
            'base_url' => 'not-a-url', // Invalid
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'errors' => [
                    'name',
                    'type',
                    'base_url',
                ]
            ]);
    }
} 