<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create Passport personal access client for testing
        $this->artisan('passport:client', [
            '--name' => 'Test Personal Access Client',
            '--personal' => true,
            '--no-interaction' => true,
        ]);
    }
}
