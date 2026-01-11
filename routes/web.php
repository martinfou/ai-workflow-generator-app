<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Prompt Builder Routes
    Route::get('prompts/builder', [\App\Http\Controllers\PromptBuilderController::class, 'index'])
        ->name('prompts.builder');
    Route::post('prompts', [\App\Http\Controllers\PromptBuilderController::class, 'store'])
        ->name('prompts.store');
    Route::put('prompts/{template}', [\App\Http\Controllers\PromptBuilderController::class, 'update'])
        ->name('prompts.update');
    Route::delete('prompts/{template}', [\App\Http\Controllers\PromptBuilderController::class, 'destroy'])
        ->name('prompts.destroy');
    Route::post('prompts/{template}/test', [\App\Http\Controllers\PromptBuilderController::class, 'test'])
        ->name('prompts.test');
    Route::get('prompts/{template}/tests', [\App\Http\Controllers\PromptBuilderController::class, 'tests'])
        ->name('prompts.tests');
    Route::post('prompts/preview', [\App\Http\Controllers\PromptBuilderController::class, 'preview'])
        ->name('prompts.preview');
    Route::post('prompts/improve', [\App\Http\Controllers\PromptBuilderController::class, 'improve'])
        ->name('prompts.improve');
    Route::post('prompts/refine', [\App\Http\Controllers\PromptBuilderController::class, 'refine'])
        ->name('prompts.refine');
});

require __DIR__.'/settings.php';
