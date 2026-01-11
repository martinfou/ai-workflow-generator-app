<?php

namespace Database\Seeders;

use App\Models\PromptTemplate;
use App\Services\Prompt\PromptService;
use Illuminate\Database\Seeder;

class PromptTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $systemTemplates = PromptService::getSystemTemplates();

        foreach ($systemTemplates as $template) {
            PromptTemplate::updateOrCreate(
                [
                    'name' => $template['name'],
                    'is_system' => true,
                ],
                $template
            );
        }

        $this->command->info('Seeded '.count($systemTemplates).' system prompt templates.');
    }
}
