<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Source;
use App\Models\UserPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * @group Articles
 * 
 * Article management and search functionality.
 * All filtering is performed on local database data, not live sources.
 */
class ArticleController extends Controller
{
    /**
     * Search Articles
     * 
     * Search and filter articles from the local database. All filtering is performed on local data, not live sources.
     * 
     * @authenticated
     * 
     * @queryParam q string Search term to filter articles by title, content, or author. Example: Wimbledon
     * @queryParam start_date string Start date for filtering (Y-m-d format). Example: 2025-07-01
     * @queryParam end_date string End date for filtering (Y-m-d format). Example: 2025-07-13
     * @queryParam category_id integer Filter by category ID. Example: 2
     * @queryParam source_id integer Filter by source ID. Example: 11
     * @queryParam per_page integer Number of articles per page (1-100). Default: 15. Example: 10
     * @queryParam sort_by string Sort field (published_at, title, source_id, category_id). Default: published_at. Example: published_at
     * @queryParam sort_order string Sort order (asc, desc). Default: desc. Example: desc
     * 
     * @response 200 {
     *   "data": [
     *     {
     *       "id": 12,
     *       "title": "Wimbledon 2025 men's singles final: Jannik Sinner v Carlos Alcaraz – live",
     *       "content": "Game-by-game report: Who will take home the title...",
     *       "url": "https://www.theguardian.com/sport/live/2025/jul/13/wimbledon-mens-singles-final...",
     *       "image_url": "https://media.guim.co.uk/941ac97c2acc6715d1dbf122f1f2d6310e4801f8/1389_11_3937_3150/500.jpg",
     *       "author": "Daniel Harris",
     *       "published_at": "2025-07-13T18:22:52.000000Z",
     *       "source_id": 11,
     *       "category_id": 2,
     *       "source": {
     *         "id": 11,
     *         "name": "The Guardian",
     *         "url": "https://www.theguardian.com",
     *         "description": "The Guardian - British daily newspaper",
     *         "is_active": true
     *       },
     *       "category": {
     *         "id": 2,
     *         "name": "Sports",
     *         "description": "Sports news and updates"
     *       }
     *     }
     *   ],
     *   "meta": {
     *     "current_page": 1,
     *     "last_page": 27,
     *     "per_page": 3,
     *     "total": 80,
     *     "total_articles_in_database": 80,
     *     "search_performed_on": "local_database",
     *     "filters_applied": {
     *       "search_term": "Wimbledon",
     *       "date_range": [],
     *       "category_id": null,
     *       "source_id": null
     *     }
     *   }
     * }
     */
    public function search(Request $request)
    {
        // Validate request parameters
        $validator = Validator::make($request->all(), [
            'q' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'category_id' => 'nullable|integer',
            'source_id' => 'nullable|integer',
            'per_page' => 'nullable|integer|min:1|max:100',
            'sort_by' => 'nullable|in:published_at,title,source_id,category_id',
            'sort_order' => 'nullable|in:asc,desc',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Start with base query - ALL filtering happens on local database data
        $query = Article::with(['source', 'category']);

        // Apply search filter on local data
        if ($request->filled('q')) {
            $query->search($request->q);
        }

        // Apply date filters on local data
        if ($request->filled('start_date') || $request->filled('end_date')) {
            $query->filterByDate($request->start_date, $request->end_date);
        }

        // Apply category filter on local data (only if category exists)
        if ($request->filled('category_id')) {
            $query->filterByCategory($request->category_id);
        }

        // Apply source filter on local data (only if source exists)
        if ($request->filled('source_id')) {
            $query->filterBySource($request->source_id);
        }

        // Apply sorting on local data
        $sortBy = $request->get('sort_by', 'published_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginate results from local database
        $perPage = $request->get('per_page', 15);
        $articles = $query->paginate($perPage);

        // Add bookmark status to each article
        $articles->getCollection()->transform(function ($article) use ($request) {
            $article->is_bookmarked = $article->isBookmarkedBy($request->user());
            return $article;
        });

        return response()->json([
            'data' => $articles->items(),
            'total' => $articles->total(),
            'per_page' => $articles->perPage(),
            'current_page' => $articles->currentPage(),
            'last_page' => $articles->lastPage(),
            'meta' => [
                'total_articles_in_database' => Article::count(),
                'search_performed_on' => 'local_database',
                'filters_applied' => [
                    'search_term' => $request->get('q'),
                    'date_range' => $request->only(['start_date', 'end_date']),
                    'category_id' => $request->get('category_id'),
                    'source_id' => $request->get('source_id'),
                ]
            ]
        ]);
    }

    /**
     * Get Personalized Feed
     * 
     * Get a personalized news feed based on user preferences. All filtering is performed on local database data.
     * 
     * @authenticated
     * 
     * @queryParam q string Search term to filter articles by title, content, or author. Example: technology
     * @queryParam start_date string Start date for filtering (Y-m-d format). Example: 2025-07-01
     * @queryParam end_date string End date for filtering (Y-m-d format). Example: 2025-07-13
     * @queryParam per_page integer Number of articles per page (1-100). Default: 15. Example: 10
     * @queryParam sort_by string Sort field (published_at, title, source_id, category_id). Default: published_at. Example: published_at
     * @queryParam sort_order string Sort order (asc, desc). Default: desc. Example: desc
     * 
     * @response 200 {
     *   "data": [
     *     {
     *       "id": 12,
     *       "title": "Wimbledon 2025 men's singles final: Jannik Sinner v Carlos Alcaraz – live",
     *       "content": "Game-by-game report: Who will take home the title...",
     *       "url": "https://www.theguardian.com/sport/live/2025/jul/13/wimbledon-mens-singles-final...",
     *       "image_url": "https://media.guim.co.uk/941ac97c2acc6715d1dbf122f1f2d6310e4801f8/1389_11_3937_3150/500.jpg",
     *       "author": "Daniel Harris",
     *       "published_at": "2025-07-13T18:22:52.000000Z",
     *       "source_id": 11,
     *       "category_id": 2,
     *       "source": {
     *         "id": 11,
     *         "name": "The Guardian",
     *         "url": "https://www.theguardian.com",
     *         "description": "The Guardian - British daily newspaper",
     *         "is_active": true
     *       },
     *       "category": {
     *         "id": 2,
     *         "name": "Sports",
     *         "description": "Sports news and updates"
     *       }
     *     }
     *   ],
     *   "meta": {
     *     "current_page": 1,
     *     "last_page": 27,
     *     "per_page": 3,
     *     "total": 80,
     *     "total_articles_in_database": 80,
     *     "feed_type": "personalized",
     *     "search_performed_on": "local_database",
     *     "user_preferences_applied": true,
     *     "filters_applied": {
     *       "search_term": "technology",
     *       "date_range": []
     *     }
     *   }
     * }
     */
    public function feed(Request $request)
    {
        // Validate request parameters
        $validator = Validator::make($request->all(), [
            'q' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'per_page' => 'nullable|integer|min:1|max:100',
            'sort_by' => 'nullable|in:published_at,title,source_id,category_id',
            'sort_order' => 'nullable|in:asc,desc',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Start with base query - ALL filtering happens on local database data
        $query = Article::with(['source', 'category']);

        // Apply user preferences filter on local data
        $query->filterByUserPreferences($request->user());

        // Apply search filter on local data
        if ($request->filled('q')) {
            $query->search($request->q);
        }

        // Apply date filters on local data
        if ($request->filled('start_date') || $request->filled('end_date')) {
            $query->filterByDate($request->start_date, $request->end_date);
        }

        // Apply sorting on local data
        $sortBy = $request->get('sort_by', 'published_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginate results from local database
        $perPage = $request->get('per_page', 15);
        $articles = $query->paginate($perPage);

        // Add bookmark status to each article
        $articles->getCollection()->transform(function ($article) use ($request) {
            $article->is_bookmarked = $article->isBookmarkedBy($request->user());
            return $article;
        });

        return response()->json([
            'data' => $articles->items(),
            'total' => $articles->total(),
            'per_page' => $articles->perPage(),
            'current_page' => $articles->currentPage(),
            'last_page' => $articles->lastPage(),
            'meta' => [
                'total_articles_in_database' => Article::count(),
                'feed_type' => 'personalized',
                'search_performed_on' => 'local_database',
                'user_preferences_applied' => true,
                'filters_applied' => [
                    'search_term' => $request->get('q'),
                    'date_range' => $request->only(['start_date', 'end_date']),
                ]
            ]
        ]);
    }

    /**
     * Get Dashboard Stats
     * 
     * Get basic statistics for the dashboard.
     * 
     * @authenticated
     * 
     * @response 200 {
     *   "stats": {
     *     "total_articles": 94,
     *     "total_bookmarks": 5,
     *     "total_sources": 3,
     *     "todays_articles": 12
     *   }
     * }
     */
    public function dashboardStats(Request $request)
    {
        $user = $request->user();
        
        $stats = [
            'total_articles' => Article::count(),
            'total_bookmarks' => $user->bookmarks()->count(),
            'total_sources' => Source::where('is_active', true)->count(),
            'todays_articles' => Article::whereDate('published_at', today())->count(),
        ];
        
        return response()->json(['stats' => $stats]);
    }

    /**
     * Get Categories
     * 
     * Get all available article categories.
     * 
     * @authenticated
     * 
     * @response 200 {
     *   "data": [
     *     {
     *       "id": 1,
     *       "name": "Technology",
     *       "description": "Latest technology news and updates"
     *     }
     *   ]
     * }
     */
    public function categories()
    {
        $categories = Category::orderBy('name')->get();
        return response()->json(['data' => $categories]);
    }

    /**
     * Get Sources
     * 
     * Get all active news sources.
     * 
     * @authenticated
     * 
     * @response 200 {
     *   "data": [
     *     {
     *       "id": 11,
     *       "name": "The Guardian",
     *       "url": "https://www.theguardian.com",
     *       "description": "The Guardian - British daily newspaper",
     *       "is_active": true
     *     }
     *   ]
     * }
     */
    public function sources()
    {
        $sources = Source::where('is_active', true)->orderBy('name')->get();
        return response()->json(['data' => $sources]);
    }

    /**
     * Get User Preferences
     * 
     * Get the current user's news preferences.
     * 
     * @authenticated
     * 
     * @response 200 {
     *   "preferences": {
     *     "id": 1,
     *     "user_id": 1,
     *     "preferred_sources": [11, 16],
     *     "preferred_categories": [1, 2],
     *     "preferred_authors": ["John Doe"],
     *     "include_all_sources": false,
     *     "include_all_categories": false,
     *     "include_all_authors": true
     *   }
     * }
     */
    public function getPreferences(Request $request)
    {
        $preferences = $request->user()->getOrCreatePreferences();
        
        return response()->json([
            'preferences' => $preferences
        ]);
    }

    /**
     * Update User Preferences
     * 
     * Update the current user's news preferences.
     * 
     * @authenticated
     * 
     * @bodyParam preferred_sources array optional Array of source IDs. Example: [11, 16]
     * @bodyParam preferred_categories array optional Array of category IDs. Example: [1, 2]
     * @bodyParam preferred_authors array optional Array of author names. Example: ["John Doe"]
     * @bodyParam include_all_sources boolean optional Include all sources. Example: false
     * @bodyParam include_all_categories boolean optional Include all categories. Example: false
     * @bodyParam include_all_authors boolean optional Include all authors. Example: true
     * 
     * @response 200 {
     *   "message": "Preferences updated successfully",
     *   "preferences": {
     *     "id": 1,
     *     "user_id": 1,
     *     "preferred_sources": [11, 16],
     *     "preferred_categories": [1, 2],
     *     "preferred_authors": ["John Doe"],
     *     "include_all_sources": false,
     *     "include_all_categories": false,
     *     "include_all_authors": true
     *   }
     * }
     */
    public function updatePreferences(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'preferred_sources' => 'nullable|array',
            'preferred_sources.*' => 'integer|exists:sources,id',
            'preferred_categories' => 'nullable|array',
            'preferred_categories.*' => 'integer|exists:categories,id',
            'preferred_authors' => 'nullable|array',
            'preferred_authors.*' => 'string|max:255',
            'include_all_sources' => 'boolean',
            'include_all_categories' => 'boolean',
            'include_all_authors' => 'boolean',
            'reading_speed' => 'nullable|in:slow,normal,fast',
            'font_size' => 'nullable|in:small,medium,large',
            'auto_refresh_interval' => 'nullable|integer|min:1|max:1440',
            'show_summaries' => 'boolean',
            'dark_mode_preferred' => 'boolean',
            'notification_preferences' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $preferences = $request->user()->getOrCreatePreferences();
        $preferences->update($request->all());

        return response()->json([
            'message' => 'Preferences updated successfully',
            'preferences' => $preferences->fresh()
        ]);
    }

    /**
     * Reset User Preferences
     * 
     * Reset the current user's news preferences to default values.
     * 
     * @authenticated
     * 
     * @response 200 {
     *   "message": "Preferences reset to default",
     *   "preferences": {
     *     "id": 1,
     *     "user_id": 1,
     *     "preferred_sources": null,
     *     "preferred_categories": null,
     *     "preferred_authors": null,
     *     "include_all_sources": true,
     *     "include_all_categories": true,
     *     "include_all_authors": true
     *   }
     * }
     */
    public function resetPreferences(Request $request)
    {
        $preferences = $request->user()->getOrCreatePreferences();
        $preferences->update([
            'preferred_sources' => null,
            'preferred_categories' => null,
            'preferred_authors' => null,
            'include_all_sources' => true,
            'include_all_categories' => true,
            'include_all_authors' => true,
            'reading_speed' => 'normal',
            'font_size' => 'medium',
            'auto_refresh_interval' => 30,
            'show_summaries' => true,
            'dark_mode_preferred' => false,
            'notification_preferences' => null,
        ]);

        return response()->json([
            'message' => 'Preferences reset to default',
            'preferences' => $preferences->fresh()
        ]);
    }
}
