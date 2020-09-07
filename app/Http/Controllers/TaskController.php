<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Task;

class TaskController extends Controller
{    
    /**
     * createTask
     *
     * @param  mixed $request
     * @return json $response
     */
    public function create(Request $request) {
        // Validate data to avoid empty fields
        $validatedData = Validator::make($request->all(), [
            'name' => 'required',
        ]);
        if($validatedData->fails()) {
            $response = [
                'error' => 'Cannot create task'
            ];
        } else {
            // Create new task
            // @TODO check if laravel is properly escaping string
            $newUser = Task::create([
                'name' => $request->name,
                'detail' => $request->detail ? $request->detail : '',
                'user_id' => $request->user()->id,
            ]);
            $response = [
                'success' => 'task created'
            ];
        }
        return response()->json($response);
    }

    public function delete(Request $request) {

        // Add validator
        $validatedData = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if($validatedData->fails()) {
            $response = [
                'error' => 'Cannot delete task'
            ];
        } else {
            $task = Task::where([
                ['id', '=', $request->input('id')],
                ['user_id', '=', $request->user()->id],
                ['is_deleted', '=', 0],
            ])->first();
            if($task) {
                $task->is_deleted = 1;
                $task->save();
                $response = [
                    "success" => "task with id " . $request->input('id') . " has been deleted"
                ];
            } else {
                $response = [
                    "error" => "task with id " . $request->input('id') . " cannot be deleted"
                ];
            }
        }
        return response()->json($response);
    }

    public function update(Request $request) {

        // Add validator
        $validatedData = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if($validatedData->fails()) {
            $response = [
                'error' => 'Cannot update task'
            ];
        } else {
            $task = Task::where([
                ['id', '=', $request->input('id')],
                ['user_id', '=', $request->user()->id],
            ])->first();
            if($task) {
                $values = $request->input();
                foreach ($values as $key => $value) {
                    if($key !== 'id' && $value !== null) {
                        $task->$key = $value;
                    }
                };

                $task->save();
                $response = [
                    "success" => "task with id " . $request->input('id') . " has been updated"
                ];
            } else {
                $response = [
                    "error" => "task with id " . $request->input('id') . " cannot be updated"
                ];
            }
        }
        return response()->json($response);
    }
    
    /**
     * getAll
     * I choose to return detail amongst all the other data. it's not the best way to do that, but it will avoid making a request every time
     * we display the detail of a task. UPDATE in cas of high frequentation
     *
     * @param  mixed $request
     * @return void
     */
    public function getAll(Request $request) {
        $tasks = Task::where([
            ['user_id', '=', $request->user()->id],
            ['is_deleted', '!=', 1]
        ])->get();
        return response()->json($tasks);
    }

    public function getOne(Request $request) {
        $tasks = Task::where([
            ['user_id', '=', $request->user()->id],
            ['id', '=', $request->input('id')],
        ])->get();
        return response()->json($tasks);
    }
}
