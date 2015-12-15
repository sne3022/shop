<?php

namespace App\Providers\Shop;

use Illuminate\Support\ServiceProvider;

class ShopServiceProvider extends ServiceProvider
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
            'App\Contracts\Shop\IItem',
            'App\Services\Shop\ItemService'
         );
         $this->app->bind(
            'App\Contracts\Shop\IOption',
            'App\Services\Shop\OptionService'
         );
         $this->app->bind(
            'App\Contracts\Shop\IFile',
            'App\Services\Shop\FileUploadService'
         );
    }
}