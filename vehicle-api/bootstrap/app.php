<?php

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->renderable(function (ModelNotFoundException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Not Found',
                    'message' => 'The specified resource was not found.',
                ], 404);
            }
        });

        $exceptions->renderable(function (NotFoundHttpException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Not Found',
                    'message' => 'The requested URL was not found.',
                ], 404);
            }
        });

        $exceptions->renderable(function (\Throwable $e, $request) {
            if ($request->expectsJson()) {

                $statusCode = property_exists($e, 'status') ? $e->status : 500;

                if ($statusCode >= 500) {
                    return response()->json([
                        'error' => 'Internal Server Error',
                        'message' => 'An unexpected error occurred. Please try again later.',
                        // 'exception' => get_class($e),
                        // 'trace' => $e->getTraceAsString(),
                    ], 500);
                }
            }
        });
    })->create();
