<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Validator;
use App\User;


class AuthenticationController extends Controller
{
    
    /**
     * createAccount
     *
     * @param  mixed $request
     * @return json $response
     */
    public function createAccount(Request $request) {
        // Validate data to avoid empty fields
        $validatedData = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|unique:users',
            'password' => 'required',

        ]);
        if($validatedData->fails()) {
            $response = [
                'error' => 'Cannot create user'
            ];
        } else {
            // Create new user
            // @TODO check if laravel is properly escaping string
            $newUser = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            $response = [
                'success' => 'user created'
            ];
        }
        return response()->json($response);
    }

    
    /**
     * login
     *
     * @param  mixed $request
     * @return json $response
     */
    public function login(Request $request) {
        $currentUser = User::where('email', $request->input('email'))->first();
        $response = [];

        if($currentUser) {
            if(Hash::check($request->input('password'), $currentUser->password)) {
                // Create token which will allow future connection
                $connectionToken = $currentUser->createToken('Laravel Password Grant Client')->accessToken;
                $response = [
                    'token' => $connectionToken,
                ];
            } else {
                $response = [
                    'error' => 'Password or user not found'
                ];
            }
        } else {
            $response = [
                'error' => 'User not found'
            ];
        }
        return response()->json($response);
    }
    
    /**
     * logout
     *
     * @param  mixed $request
     * @return json $response
     */
    public function logout(Request $request) {
        $token = $request->user()->token();
        if($token) {
            // Revoke token, to force user to reconnect, because they current token will not work
            $request->user()->token()->revoke();
            return response()->json([
                'success' => 'user deauthenticated',
            ]);
        }
        return response()->json([
            'error' => 'Cannot find user token',
        ]);
    }


    public function changePassword(Request $request) {
        //@TODO if there is enough time
    }
}
