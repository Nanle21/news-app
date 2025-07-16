<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Bookmark;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BookmarkController extends Controller
{
    /**
     * Toggle bookmark for an article
     */
    public function toggle(Request $request, $articleId): JsonResponse
    {
        $user = $request->user();
        $article = Article::findOrFail($articleId);

        $bookmark = Bookmark::where('user_id', $user->id)
            ->where('article_id', $articleId)
            ->first();

        if ($bookmark) {
            // Remove bookmark
            $bookmark->delete();
            return response()->json([
                'message' => 'Bookmark removed',
                'bookmarked' => false
            ]);
        } else {
            // Add bookmark
            Bookmark::create([
                'user_id' => $user->id,
                'article_id' => $articleId
            ]);
            return response()->json([
                'message' => 'Article bookmarked',
                'bookmarked' => true
            ]);
        }
    }

    /**
     * Get user's bookmarked articles
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $perPage = $request->get('per_page', 15);
        $search = $request->get('q');
        $categoryId = $request->get('category_id');
        $sourceId = $request->get('source_id');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');
        $sortBy = $request->get('sort_by', 'published_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $query = $user->bookmarkedArticles()
            ->with(['source', 'category'])
            ->when($search, function ($q) use ($search) {
                $q->search($search);
            })
            ->when($categoryId, function ($q) use ($categoryId) {
                $q->filterByCategory($categoryId);
            })
            ->when($sourceId, function ($q) use ($sourceId) {
                $q->filterBySource($sourceId);
            })
            ->when($startDate || $endDate, function ($q) use ($startDate, $endDate) {
                $q->filterByDate($startDate, $endDate);
            })
            ->orderBy($sortBy, $sortOrder);

        $articles = $query->paginate($perPage);

        // Add bookmark status to each article
        $articles->getCollection()->transform(function ($article) use ($user) {
            $article->is_bookmarked = true; // All articles in this query are bookmarked
            return $article;
        });

        return response()->json([
            'data' => $articles->items(),
            'meta' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'per_page' => $articles->perPage(),
                'total' => $articles->total(),
                'total_bookmarks' => $user->bookmarks()->count(),
            ]
        ]);
    }

    /**
     * Check if an article is bookmarked by the user
     */
    public function check(Request $request, $articleId): JsonResponse
    {
        $user = $request->user();
        $isBookmarked = Bookmark::where('user_id', $user->id)
            ->where('article_id', $articleId)
            ->exists();

        return response()->json([
            'bookmarked' => $isBookmarked
        ]);
    }
}
