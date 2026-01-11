<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('prompt_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('category');
            $table->text('description')->nullable();
            $table->text('content');
            $table->json('variables')->nullable();
            $table->text('intent')->nullable();
            $table->text('expected_output_format')->nullable();
            $table->boolean('is_system')->default(false);
            $table->boolean('is_favorite')->default(false);
            $table->integer('usage_count')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'category']);
            $table->index(['user_id', 'is_favorite']);
            $table->index('is_system');
        });

        Schema::create('prompt_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('prompt_template_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_llm_setting_id')->constrained()->onDelete('cascade');
            $table->text('rendered_prompt');
            $table->json('input_variables');
            $table->text('response')->nullable();
            $table->enum('status', ['success', 'error', 'timeout'])->default('success');
            $table->text('error_message')->nullable();
            $table->integer('tokens_used')->nullable();
            $table->integer('duration_ms')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'prompt_template_id']);
            $table->index(['prompt_template_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prompt_tests');
        Schema::dropIfExists('prompt_templates');
    }
};
