<?php

namespace sneboard_shop\Providers\Shop;

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
            'sneboard_shop\Contracts\Shop\IItem',
            'sneboard_shop\Services\Shop\ItemService'
         );
         $this->app->bind(
            'sneboard_shop\Contracts\Shop\IOption',
            'sneboard_shop\Services\Shop\OptionService'
         );
         $this->app->bind(
            'sneboard_shop\Contracts\Shop\IFile',
            'sneboard_shop\Services\Shop\FileUploadService'
         );
    }
}