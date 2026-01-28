<?php

namespace App\Http\Controllers\Api;

use App\Models\Court;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CourtController extends Controller
{
    /**
     * Display a listing of courts.
     */
    public function index(Request $request)
    {
        $query = Court::with(['owner:id,first_name,last_name,email', 'approver:id,first_name,last_name']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by city
        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $courts = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $courts,
        ]);
    }

    /**
     * Store a newly created court.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:indoor,outdoor,both',
            'surface' => 'required|in:concrete,asphalt,sport_court,wood,other',
            'address' => 'required|string',
            'city' => 'required|string',
            'state_province' => 'nullable|string',
            'country' => 'required|string',
            'postal_code' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'number_of_courts' => 'required|integer|min:1',
            'amenities' => 'nullable|array',
            'hours_of_operation' => 'nullable|array',
            'is_free' => 'boolean',
            'price_per_hour' => 'nullable|numeric|min:0',
            'peak_hour_price' => 'nullable|numeric|min:0',
            'phone_number' => 'nullable|string',
            'email' => 'nullable|email',
            'website' => 'nullable|url',
            'requires_booking' => 'boolean',
            'booking_url' => 'nullable|url',
            'images' => 'nullable|array',
            'cover_image' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $court = Court::create(array_merge(
            $validator->validated(),
            ['owner_id' => $request->user()->id]
        ));

        return response()->json([
            'success' => true,
            'message' => 'Court created successfully',
            'data' => $court->load('owner'),
        ], 201);
    }

    /**
     * Display the specified court.
     */
    public function show($id)
    {
        $court = Court::with(['owner', 'approver'])->findOrFail($id);
        $court->incrementViews();

        return response()->json([
            'success' => true,
            'data' => $court,
        ]);
    }

    /**
     * Update the specified court.
     */
    public function update(Request $request, $id)
    {
        $court = Court::findOrFail($id);

        // Check authorization
        if ($request->user()->id !== $court->owner_id && !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:indoor,outdoor,both',
            'surface' => 'sometimes|in:concrete,asphalt,sport_court,wood,other',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string',
            'number_of_courts' => 'sometimes|integer|min:1',
            'amenities' => 'nullable|array',
            'hours_of_operation' => 'nullable|array',
            'is_free' => 'sometimes|boolean',
            'price_per_hour' => 'nullable|numeric|min:0',
            'phone_number' => 'nullable|string',
            'email' => 'nullable|email',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $court->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Court updated successfully',
            'data' => $court->fresh(['owner', 'approver']),
        ]);
    }

    /**
     * Remove the specified court.
     */
    public function destroy(Request $request, $id)
    {
        $court = Court::findOrFail($id);

        // Check authorization
        if ($request->user()->id !== $court->owner_id && !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $court->delete();

        return response()->json([
            'success' => true,
            'message' => 'Court deleted successfully',
        ]);
    }

    /**
     * Approve a court (Admin only).
     */
    public function approve(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $court = Court::findOrFail($id);
        $court->approve($request->user()->id);

        return response()->json([
            'success' => true,
            'message' => 'Court approved successfully',
            'data' => $court->fresh(['owner', 'approver']),
        ]);
    }

    /**
     * Reject a court (Admin only).
     */
    public function reject(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'reason' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $court = Court::findOrFail($id);
        $court->reject($request->reason);

        return response()->json([
            'success' => true,
            'message' => 'Court rejected',
            'data' => $court->fresh(['owner', 'approver']),
        ]);
    }

    /**
     * Suspend a court (Admin only).
     */
    public function suspend(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $court = Court::findOrFail($id);
        $court->suspend($request->reason);

        return response()->json([
            'success' => true,
            'message' => 'Court suspended',
            'data' => $court->fresh(['owner', 'approver']),
        ]);
    }

    /**
     * Get court statistics (Admin only).
     */
    public function statistics(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $stats = [
            'total' => Court::count(),
            'pending' => Court::where('status', 'pending')->count(),
            'approved' => Court::where('status', 'approved')->count(),
            'rejected' => Court::where('status', 'rejected')->count(),
            'suspended' => Court::where('status', 'suspended')->count(),
            'active' => Court::where('is_active', true)->count(),
            'featured' => Court::where('is_featured', true)->count(),
            'average_rating' => round(Court::where('rating', '>', 0)->avg('rating'), 2),
            'total_bookings' => Court::sum('total_bookings'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
