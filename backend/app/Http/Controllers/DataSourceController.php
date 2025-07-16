<?php

namespace App\Http\Controllers;

use App\Models\DataSource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * @group Data Sources
 * 
 * External news data source management and operations.
 */
class DataSourceController extends Controller
{
    /**
     * List Data Sources
     * 
     * Get all configured data sources.
     * 
     * @authenticated
     * 
     * @response 200 {
     *   "data": [
     *     {
     *       "id": 1,
     *       "name": "NewsAPI.org",
     *       "type": "newsapi",
     *       "base_url": "https://newsapi.org/v2",
     *       "api_key": "***",
     *       "config": null,
     *       "is_active": true,
     *       "rate_limit_per_hour": 1000,
     *       "last_fetched_at": "2025-07-13T18:22:56.000000Z",
     *       "articles_count": 25,
     *       "created_at": "2025-07-13T18:22:56.000000Z",
     *       "updated_at": "2025-07-13T18:22:56.000000Z"
     *     }
     *   ]
     * }
     */
    public function index()
    {
        $dataSources = DataSource::orderBy('name')->get();
        return response()->json(['data' => $dataSources]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255|unique:data_sources,type',
            'base_url' => 'required|url',
            'api_key' => 'nullable|string',
            'config' => 'nullable|array',
            'is_active' => 'boolean',
            'rate_limit_per_hour' => 'integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $dataSource = DataSource::create($request->all());

        return response()->json([
            'message' => 'Data source created successfully',
            'data_source' => $dataSource
        ], 201);
    }

    public function show(DataSource $dataSource)
    {
        return response()->json(['data_source' => $dataSource]);
    }

    public function update(Request $request, DataSource $dataSource)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|max:255|unique:data_sources,type,' . $dataSource->id,
            'base_url' => 'sometimes|required|url',
            'api_key' => 'nullable|string',
            'config' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
            'rate_limit_per_hour' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $dataSource->update($request->all());

        return response()->json([
            'message' => 'Data source updated successfully',
            'data_source' => $dataSource->fresh()
        ]);
    }

    public function destroy(DataSource $dataSource)
    {
        $dataSource->delete();

        return response()->json([
            'message' => 'Data source deleted successfully'
        ]);
    }

    public function test(DataSource $dataSource)
    {
        try {
            $service = \App\Services\NewsServiceFactory::create($dataSource);
            $articles = $service->fetchArticles(['pageSize' => 5]);

            return response()->json([
                'message' => 'Test successful',
                'articles_fetched' => count($articles),
                'data_source' => $dataSource
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Test failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function fetch(DataSource $dataSource)
    {
        try {
            $service = \App\Services\NewsServiceFactory::create($dataSource);
            $articles = $service->fetchArticles(['pageSize' => 50]);

            $dataSource->updateLastFetched();
            $dataSource->increment('articles_count', count($articles));

            return response()->json([
                'message' => 'Articles fetched successfully',
                'articles_fetched' => count($articles),
                'data_source' => $dataSource->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Fetch failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
