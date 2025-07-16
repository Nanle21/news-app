<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\ClientRepository;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
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
    }

    public function test_user_can_register_without_email_verification(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/auth/register', $userData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'created_at',
                    'updated_at'
                ],
                'token',
                'email_verification_sent'
            ]);

        $user = User::where('email', 'john@example.com')->first();
        $this->assertNull($user->email_verified_at);
    }

    public function test_user_can_login_without_email_verification(): void
    {
        $user = User::factory()->unverified()->create([
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
        ]);

        $loginData = [
            'email' => 'john@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/auth/login', $loginData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'created_at',
                    'updated_at'
                ],
                'token',
                'email_verification_required'
            ]);
    }

    public function test_user_cannot_access_restricted_features_without_verification(): void
    {
        $user = User::factory()->unverified()->create();
        $token = $user->createToken('test-token')->accessToken;

        // Try to access article search (requires verification)
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/articles/search');

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Your email address is not verified.',
                'email_verification_required' => true
            ]);
    }

    public function test_user_can_access_basic_features_without_verification(): void
    {
        $user = User::factory()->unverified()->create();
        $token = $user->createToken('test-token')->accessToken;

        // Try to access categories (doesn't require verification)
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/articles/categories');

        $response->assertStatus(200);
    }

    public function test_user_can_resend_verification_email(): void
    {
        $user = User::factory()->unverified()->create();
        $token = $user->createToken('test-token')->accessToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/email/verification-notification');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Verification link sent!'
            ]);
    }

    public function test_user_can_verify_email_via_api(): void
    {
        $user = User::factory()->unverified()->create();
        $token = $user->createToken('test-token')->accessToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/email/verify');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Email has been verified'
            ]);

        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    public function test_verified_user_can_access_all_features(): void
    {
        $user = User::factory()->create(); // Already verified by default
        $token = $user->createToken('test-token')->accessToken;

        // Try to access article search (requires verification)
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/articles/search');

        $response->assertStatus(200);
    }

    public function test_verified_user_cannot_resend_verification_email(): void
    {
        $user = User::factory()->create(); // Already verified by default
        $token = $user->createToken('test-token')->accessToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/email/verification-notification');

        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Email already verified'
            ]);
    }
} 