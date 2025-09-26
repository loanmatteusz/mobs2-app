<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class VehicleCreationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     * Should authenticate user create a vehicle successfully
     */
    public function authenticated_user_can_create_a_vehicle()
    {
        $user = User::factory()->create();

        $data = [
            'brand' => 'Honda',
            'model' => 'Civic',
            'plate' => 'BRA2025',
            'year' => 2025,
        ];

        $response = $this->actingAs($user, 'api')->postJson('/api/vehicles', $data);

        $response->assertStatus(201);
        $response->assertJsonFragment([
            'message' => 'Vehicle created successfully',
            'plate' => 'BRA2025',
        ]);
        $this->assertDatabaseHas('vehicles', [
            'plate' => 'BRA2025',
            'model' => 'Civic',
        ]);
    }

    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
