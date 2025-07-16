<?php

namespace App\Services;

use App\Models\DataSource;
use App\Services\NewsApis\NewsApiService;
use App\Services\NewsApis\GuardianApiService;
use App\Services\NewsApis\BbcApiService;
use InvalidArgumentException;

class NewsServiceFactory
{
    public static function create(DataSource $dataSource)
    {
        switch ($dataSource->type) {
            case 'newsapi':
                return new NewsApiService($dataSource);
            
            case 'guardian':
                return new GuardianApiService($dataSource);
            
            case 'bbc':
                return new BbcApiService($dataSource);
            
            default:
                throw new InvalidArgumentException("Unsupported news API type: {$dataSource->type}");
        }
    }
} 