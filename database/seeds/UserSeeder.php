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
                'name' => "morgan",
                'email' => 'morgan@corroyer.fr',
                'password' => Hash::make('admin'),
            )
        );
    }
}
