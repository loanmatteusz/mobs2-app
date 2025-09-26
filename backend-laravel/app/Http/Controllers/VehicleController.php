<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $vehicles = Vehicle::paginate(10);
        return response()->json($vehicles);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $vehicle = $request->validate([
            'brand' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'plate' => ['required', 'string', 'max:20', Rule::unique('vehicles', 'plate')],
            'year' => ['required', 'integer', 'digits:4', 'min:1900', 'max:' . (date('Y') + 1)],
        ]);

        $vehicleCreated = Vehicle::create($vehicle);

        return response()->json([
            'message' => 'Vehicle created successfully',
            'vehicle' => $vehicleCreated,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Vehicle $vehicle)
    {
        return response()->json([
            'vehicle' => $vehicle,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vehicle $vehicle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'brand' => ['sometimes', 'required', 'string', 'max:100'],
            'model' => ['sometimes', 'required', 'string', 'max:100'],
            'plate' => [
                'sometimes',
                'required',
                'string',
                'max:20',
                Rule::unique('vehicles', 'plate')->ignore($vehicle),
            ],
            'year' => ['sometimes', 'required', 'integer', 'digits:4', 'min:1900', 'max:' . (date('Y') + 1)],
        ]);

        $vehicle->update($validated);

        return response()->json([
            'message' => 'Vehicle updated successfully',
            'vehicle' => $vehicle,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return response()->noContent();
    }
}
