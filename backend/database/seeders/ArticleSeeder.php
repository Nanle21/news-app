<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\Source;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories
        $categories = [
            'Technology' => 'Latest technology news and updates',
            'Sports' => 'Sports news and updates',
            'Politics' => 'Political news and analysis',
            'Business' => 'Business and financial news',
            'Entertainment' => 'Entertainment and celebrity news',
            'Health' => 'Health and wellness news',
            'Science' => 'Scientific discoveries and research',
            'Education' => 'Education news and updates',
        ];

        foreach ($categories as $name => $description) {
            Category::create([
                'name' => $name,
                'description' => $description,
            ]);
        }

        // Create sources
        $sources = [
            'Tech News Daily' => 'https://technewsdaily.com',
            'Sports Central' => 'https://sportscentral.com',
            'Political Times' => 'https://politicaltimes.com',
            'Business Weekly' => 'https://businessweekly.com',
            'Entertainment Now' => 'https://entertainmentnow.com',
            'Health Matters' => 'https://healthmatters.com',
            'Science Today' => 'https://sciencetoday.com',
            'Education Weekly' => 'https://educationweekly.com',
        ];

        foreach ($sources as $name => $url) {
            Source::create([
                'name' => $name,
                'url' => $url,
                'description' => fake()->sentence(),
                'is_active' => true,
            ]);
        }

        // Create articles
        $articles = [
            [
                'title' => 'Laravel 11 Released with New Features',
                'content' => 'Laravel 11 has been released with exciting new features including improved performance, better developer experience, and enhanced security measures.',
                'author' => 'John Doe',
                'category' => 'Technology',
                'source' => 'Tech News Daily',
                'published_at' => now()->subDays(1),
            ],
            [
                'title' => 'React 19 Beta Now Available',
                'content' => 'The React team has released React 19 beta with concurrent features, improved hooks, and better TypeScript support.',
                'author' => 'Jane Smith',
                'category' => 'Technology',
                'source' => 'Tech News Daily',
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Championship Finals This Weekend',
                'content' => 'The championship finals are set for this weekend with two top teams competing for the ultimate prize.',
                'author' => 'Mike Johnson',
                'category' => 'Sports',
                'source' => 'Sports Central',
                'published_at' => now()->subDays(1),
            ],
            [
                'title' => 'New Policy Announced by Government',
                'content' => 'The government has announced a new policy aimed at improving economic growth and job creation.',
                'author' => 'Sarah Wilson',
                'category' => 'Politics',
                'source' => 'Political Times',
                'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'Stock Market Reaches New High',
                'content' => 'The stock market has reached a new all-time high, driven by strong corporate earnings and economic growth.',
                'author' => 'David Brown',
                'category' => 'Business',
                'source' => 'Business Weekly',
                'published_at' => now()->subDays(1),
            ],
            [
                'title' => 'New Movie Breaks Box Office Records',
                'content' => 'The latest blockbuster movie has broken box office records in its opening weekend.',
                'author' => 'Lisa Davis',
                'category' => 'Entertainment',
                'source' => 'Entertainment Now',
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Breakthrough in Cancer Research',
                'content' => 'Scientists have made a breakthrough in cancer research that could lead to new treatment options.',
                'author' => 'Dr. Robert Chen',
                'category' => 'Health',
                'source' => 'Health Matters',
                'published_at' => now()->subDays(4),
            ],
            [
                'title' => 'New Planet Discovered in Solar System',
                'content' => 'Astronomers have discovered a new planet in our solar system using advanced telescopes.',
                'author' => 'Dr. Emily Rodriguez',
                'category' => 'Science',
                'source' => 'Science Today',
                'published_at' => now()->subDays(1),
            ],
            [
                'title' => 'Online Learning Platform Launches',
                'content' => 'A new online learning platform has launched, offering courses from top universities worldwide.',
                'author' => 'Professor Michael Lee',
                'category' => 'Education',
                'source' => 'Education Weekly',
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Docker Announces New Container Features',
                'content' => 'Docker has announced new container features that improve security and performance for developers.',
                'author' => 'Alex Thompson',
                'category' => 'Technology',
                'source' => 'Tech News Daily',
                'published_at' => now()->subDays(5),
            ],
        ];

        foreach ($articles as $articleData) {
            $category = Category::where('name', $articleData['category'])->first();
            $source = Source::where('name', $articleData['source'])->first();

            Article::create([
                'title' => $articleData['title'],
                'content' => $articleData['content'],
                'author' => $articleData['author'],
                'category_id' => $category->id,
                'source_id' => $source->id,
                'published_at' => $articleData['published_at'],
                'url' => fake()->url(),
                'image_url' => fake()->imageUrl(),
            ]);
        }
    }
}
