#!/bin/sh

# Start scheduler in background
php artisan schedule:work &

# Start PHP-FPM
php-fpm 