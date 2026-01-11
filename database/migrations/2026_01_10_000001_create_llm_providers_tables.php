<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('llm_providers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('icon')->nullable();
            $table->json('config_schema')->nullable();
            $table->timestamps();
        });

        Schema::create('user_llm_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('provider_id')->constrained('llm_providers')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->json('config')->nullable();
            $table->boolean('is_default')->default(false);
            $table->enum('status', ['offline', 'testing', 'online', 'error'])->default('offline');
            $table->text('last_error')->nullable();
            $table->timestamp('last_tested_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'provider_id']);
            $table->index(['user_id', 'is_default']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_llm_settings');
        Schema::dropIfExists('llm_providers');
    }
};
