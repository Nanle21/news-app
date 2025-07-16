<?php

namespace Database\Seeders;

use App\Models\DataSource;
use Illuminate\Database\Seeder;

class DataSourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dataSources = [
            [
                'name' => 'NewsAPI.org',
                'type' => 'newsapi',
                'base_url' => 'https://newsapi.org/v2',
                'api_key' => 'd038407aeea34898948dd27d25ad4dea', // TODO: Replace with actual API key
                'config' => [
                    'language' => 'en',
                    'sort_by' => 'publishedAt',
                    'page_size' => 100,
                ],
                'is_active' => true,
                'rate_limit_per_hour' => 1000,
            ],
            [
                'name' => 'The Guardian',
                'type' => 'guardian',
                'base_url' => 'https://content.guardianapis.com',
                'api_key' => 'bfb3584d-dc3b-4042-8e76-270159a31584', // TODO: Replace with actual API key
                'config' => [
                    'show_fields' => 'headline,trailText,byline,thumbnail,lastModified',
                    'show_tags' => 'contributor,series',
                    'page_size' => 50,
                    'order_by' => 'newest',
                ],
                'is_active' => true,
                'rate_limit_per_hour' => 500,
            ],
            [
                'name' => 'BBC News',
                'type' => 'bbc',
                'base_url' => 'https://newsapi.org/v2',
                'api_key' => 'd038407aeea34898948dd27d25ad4dea',
                'config' => [
                    'domains' => 'bbc.co.uk,bbc.com',
                    'language' => 'en',
                    'sort_by' => 'publishedAt',
                    'page_size' => 100,
                ],
                'is_active' => true,
                'rate_limit_per_hour' => 1000,
            ],
        ];

        foreach ($dataSources as $dataSource) {
            DataSource::firstOrCreate(
                ['type' => $dataSource['type']],
                $dataSource
            );
        }

        $this->command->info('Data sources seeded successfully!');
        $this->command->info('API keys are hardcoded and ready to use.');
    }
}
