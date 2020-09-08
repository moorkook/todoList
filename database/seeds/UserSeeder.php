<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert(
            array(
                'name' => "Bruce Wayne",
                'email' => 'batman@dark.knight',
                'password' => Hash::make('notBruceWayne'),
            )
        );
        DB::table('users')->insert(
            array(
                'name' => "Jack Napier",
                'email' => 'joker@smiling.man',
                'password' => Hash::make('whySoSerious'),
            )
        );
        DB::table('users')->insert(
            array(
                'name' => "AOS",
                'email' => 'test@test.test',
                'password' => Hash::make('test'),
            )
        );
    }
}
