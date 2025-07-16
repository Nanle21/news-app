<?php

namespace Tests\Feature\Article;

use App\Models\Article;
use App\Models\Category;
use App\Models\Source;
use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\ClientRepository;
use Laravel\Passport\Passport;
use Tests\TestCase;

class PersonalizedNewsFeedTest extends TestCase
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
        // Do not create or authenticate a user here

        // Create test categories
        $this->techCategory = Category::factory()->create(['name' => 'Technology']);
        $this->sportsCategory = Category::factory()->create(['name' => 'Sports']);
        $this->politicsCategory = Category::factory()->create(['name' => 'Politics']);
        
        // Create test sources
        $this->techSource = Source::factory()->create(['name' => 'Tech News']);
        $this->sportsSource = Source::factory()->create(['name' => 'Sports Daily']);
        $this->politicsSource = Source::factory()->create(['name' => 'Political Times']);
        
        // Create test articles
        Article::factory()->create([
            'title' => 'Laravel Framework Best Practices',
            'content' => 'Laravel is a powerful PHP framework.',
            'author' => 'John Doe',
            'category_id' => $this->techCategory->id,
            'source_id' => $this->techSource->id,
            'published_at' => now()->subDays(1),
        ]);

        Article::factory()->create([
            'title' => 'React Development Tips',
            'content' => 'React is a popular JavaScript library.',
            'author' => 'Jane Smith',
            'category_id' => $this->techCategory->id,
            'source_id' => $this->techSource->id,
            'published_at' => now()->subDays(2),
        ]);

        Article::factory()->create([
            'title' => 'Championship Finals This Weekend',
            'content' => 'The championship finals are set for this weekend.',
            'author' => 'Mike Johnson',
            'category_id' => $this->sportsCategory->id,
            'source_id' => $this->sportsSource->id,
            'published_at' => now()->subDays(1),
        ]);

        Article::factory()->create([
            'title' => 'New Policy Announced by Government',
            'content' => 'The government has announced a new policy.',
            'author' => 'Sarah Wilson',
            'category_id' => $this->politicsCategory->id,
            'source_id' => $this->politicsSource->id,
            'published_at' => now()->subDays(3),
        ]);
    }

    public function test_user_can_get_personalized_feed_with_default_preferences(): void
    {
        $user = \App\Models\User::factory()->create();
        $this->actingAs($user, 'api');

        Passport::actingAs($user);

        $response = $this->getJson('/api/articles/feed');

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

        // Should return all articles since default preferences include all
        $response->assertJsonCount(4, 'data');
    }

    public function test_user_can_get_personalized_feed_with_preferred_sources(): void
    {
        $user = \App\Models\User::factory()->create();
        $this->actingAs($user, 'api');

        Passport::actingAs($user);

        // Set user preferences for specific sources
        $user->getOrCreatePreferences()->update([
            'preferred_sources' => [$this->techSource->id],
            'include_all_sources' => false,
        ]);

        $response = $this->getJson('/api/articles/feed');

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
        
        // Should only return articles from preferred sources
        $titles = collect($response->json('data'))->pluck('title')->toArray();
        $this->assertContains('Laravel Framework Best Practices', $titles);
        $this->assertContains('React Development Tips', $titles);
        $this->assertNotContains('Championship Finals This Weekend', $titles);
        $this->assertNotContains('New Policy Announced by Government', $titles);
    }

    public function test_user_can_get_personalized_feed_with_preferred_categories(): void
    {
        $user = \App\Models\User::factory()->create();
        $this->actingAs($user, 'api');

        Passport::actingAs($user);

        // Set user preferences for specific categories
        $user->getOrCreatePreferences()->update([
            'preferred_categories' => [$this->techCategory->id],
            'include_all_categories' => false,
        ]);

        $response = $this->getJson('/api/articles/feed');

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
        
        // Should only return articles from preferred categories
        $titles = collect($response->json('data'))->pluck('title')->toArray();
        $this->assertContains('Laravel Framework Best Practices', $titles);
        $this->assertContains('React Development Tips', $titles);
        $this->assertNotContains('Championship Finals This Weekend', $titles);
        $this->assertNotContains('New Policy Announced by Government', $titles);
    }

    public function test_user_can_get_personalized_feed_with_preferred_authors(): void
    {
        $user = \App\Models\User::factory()->create();
        $this->actingAs($user, 'api');

        Passport::actingAs($user);

        // Set user preferences for specific authors
        $user->getOrCreatePreferences()->update([
            'preferred_authors' => ['John Doe'],
            'include_all_authors' => false,
        ]);

        $response = $this->getJson('/api/articles/feed');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        
        // Should only return articles from preferred authors
        $response->assertJsonPath('data.0.title', 'Laravel Framework Best Practices');
        $response->assertJsonPath('data.0.author', 'John Doe');
    }

    public function test_user_can_get_personalized_feed_with_combined_preferences(): void
    {
        $user = \App\Models\User::factory()->create();
        $this->actingAs($user, 'api');

        Passport::actingAs($user);

        // Set user preferences for sources and categories
        $user->getOrCreatePreferences()->update([
            'preferred_sources' => [$this->techSource->id, $this->sportsSource->id],
            'preferred_categories' => [$this->techCategory->id],
            'include_all_sources' => false,
            'include_all_categories' => false,
        ]);

        $response = $this->getJson('/api/articles/feed');

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
        
        // Should return articles that match both source and category preferences
        $titles = collect($response->json('data'))->pluck('title')->toArray();
        $this->assertContains('Laravel Framework Best Practices', $titles);
        $this->assertContains('React Development Tips', $titles);
        $this->assertNotContains('Championship Finals This Weekend', $titles);
        $this->assertNotContains('New Policy Announced by Government', $titles);
    }

    public function test_user_can_get_personalized_feed_with_search_and_preferences(): void
    {
        $user = \App\Models\User::factory()->create();
        $this->actingAs($user, 'api');

        Passport::actingAs($user);

        // Set user preferences for technology category
        $user->getOrCreatePreferences()->update([
            'preferred_categories' => [$this->techCategory->id],
            'include_all_categories' => false,
        ]);

        $response = $this->getJson('/api/articles/feed?q=laravel');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        
        // Should return only Laravel article from preferred category
        $response->assertJsonPath('data.0.title', 'Laravel Framework Best Practices');
    }

    public function test_unauthenticated_user_cannot_access_personalized_feed(): void
    {
        $response = $this->withHeaders(['Authorization' => ''])->getJson('/api/articles/feed');
        $response->assertStatus(401);
    }

    public function test_user_can_update_preferences(): void
    {
        $user = \App\Models\User::factory()->create();
        $this->actingAs($user, 'api');

        Passport::actingAs($user);

        $preferences = [
            'preferred_sources' => [$this->techSource->id],
            'preferred_categories' => [$this->techCategory->id],
            'preferred_authors' => ['John Doe'],
            'include_all_sources' => false,
            'include_all_categories' => false,
            'include_all_authors' => false,
        ];

        $response = $this->putJson('/api/articles/preferences', $preferences);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'preferences' => [
                    'id',
                    'user_id',
                    'preferred_sources',
                    'preferred_categories',
                    'preferred_authors',
                    'include_all_sources',
                    'include_all_categories',
                    'include_all_authors',
                ]
            ]);

        $this->assertDatabaseHas('user_preferences', [
            'user_id' => $user->id,
            'include_all_sources' => false,
            'include_all_categories' => false,
            'include_all_authors' => false,
        ]);
    }

    public function test_user_can_get_current_preferences(): void
    {
        $user = \App\Models\User::factory()->create();
        $this->actingAs($user, 'api');

        Passport::actingAs($user);

        // Create preferences first
        $user->getOrCreatePreferences()->update([
            'preferred_sources' => [$this->techSource->id],
            'include_all_sources' => false,
        ]);

        $response = $this->getJson('/api/articles/preferences');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'preferences' => [
                    'id',
                    'user_id',
                    'preferred_sources',
                    'preferred_categories',
                    'preferred_authors',
                    'include_all_sources',
                    'include_all_categories',
                    'include_all_authors',
                ]
            ]);

        $response->assertJsonPath('preferences.preferred_sources', [$this->techSource->id]);
        $response->assertJsonPath('preferences.include_all_sources', false);
    }

    public function test_user_can_reset_preferences_to_default(): void
    {
        $user = \App\Models\User::factory()->create();
        $this->actingAs($user, 'api');

        Passport::actingAs($user);

        // Set some preferences first
        $user->getOrCreatePreferences()->update([
            'preferred_sources' => [$this->techSource->id],
            'include_all_sources' => false,
        ]);

        $response = $this->deleteJson('/api/articles/preferences');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'preferences' => [
                    'id',
                    'user_id',
                    'preferred_sources',
                    'preferred_categories',
                    'preferred_authors',
                    'include_all_sources',
                    'include_all_categories',
                    'include_all_authors',
                ]
            ]);

        $this->assertDatabaseHas('user_preferences', [
            'user_id' => $user->id,
            'include_all_sources' => true,
            'include_all_categories' => true,
            'include_all_authors' => true,
        ]);
    }

    public function test_preferences_validation(): void
    {
        $user = \App\Models\User::factory()->create();
        $this->actingAs($user, 'api');

        Passport::actingAs($user);

        $response = $this->putJson('/api/articles/preferences', [
            'preferred_sources' => 'invalid', // Should be array
            'preferred_categories' => 'invalid', // Should be array
            'preferred_authors' => 'invalid', // Should be array
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'errors' => [
                    'preferred_sources',
                    'preferred_categories',
                    'preferred_authors',
                ]
            ]);
    }
} 