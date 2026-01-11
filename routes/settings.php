<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\LlmController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');

    Route::get('settings/llm', [LlmController::class, 'index'])->name('llm.settings');

    Route::prefix('settings/llm')->name('llm.')->group(function () {
        Route::get('/providers', [LlmController::class, 'availableProviders'])->name('providers');
        Route::post('/', [LlmController::class, 'store'])->name('store');
        Route::get('/{setting}', [LlmController::class, 'show'])->name('show');
        Route::put('/{setting}', [LlmController::class, 'update'])->name('update');
        Route::delete('/{setting}', [LlmController::class, 'destroy'])->name('destroy');
        Route::post('/{setting}/test', [LlmController::class, 'test'])->name('test');
        Route::get('/{setting}/models', [LlmController::class, 'models'])->name('models');
    });
});
