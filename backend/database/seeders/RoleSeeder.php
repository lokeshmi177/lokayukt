<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run()
    {
        DB::table('roles')->insert([
            ['name' => 'admin',          'label' => 'Administrator'],
            ['name' => 'secretary',      'label' => 'Secretary'],
            ['name' => 'ro',             'label' => 'Returning Officer'],
            ['name' => 'aro',            'label' => 'Assistant RO'],
            ['name' => 'cio',            'label' => 'Chief Information Officer'],
            ['name' => 'section_officer','label' => 'Section Officer'],
        ]);
    }
}
