<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
         $this->app->bind(
            'App\Contracts\IItem',
            'App\Services\ItemService'
         );
         $this->app->bind(
            'App\Contracts\IOption',
            'App\Services\OptionService'
         );
         $this->app->bind(
            'App\Contracts\IFile',
            'App\Services\FileUploadService'
         );
    }
}
