# Coach Dashboard - Complete Implementation Guide

**Focus:** Coach Dashboard Only  
**Tech Stack:** React 19 + TypeScript + Tailwind CSS (Frontend) | Laravel 11 + PostgreSQL (Backend)  
**Purpose:** Build a complete coach dashboard with student management, lesson scheduling, and earnings tracking

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Backend Implementation](#backend-implementation)
3. [Frontend Implementation](#frontend-implementation)
4. [Component Breakdown](#component-breakdown)
5. [API Contract](#api-contract)
6. [Mock Data](#mock-data)
7. [Database Schema](#database-schema)
8. [Implementation Steps](#implementation-steps)

---

## 🎯 OVERVIEW

### Coach Dashboard Features

The Coach Dashboard provides coaches with a centralized hub to:
- ✅ View upcoming lessons and schedules
- ✅ Monitor student progress and performance
- ✅ Track monthly earnings and payouts
- ✅ See student overview (active count, ratings)
- ✅ Manage availability status
- ✅ Receive notifications about bookings/cancellations
- ✅ View recent activity feed
- ✅ Quick actions (schedule lesson, view students, manage availability)

### Key Metrics

**For Coaches:**
- Active students count
- Monthly earnings total
- Completion rate (lessons completed vs scheduled)
- Upcoming lessons count
- Average rating
- Total lessons given (lifetime)

---

## 🔌 BACKEND IMPLEMENTATION

### 1. Database Models

#### DashboardActivity Model

```php
// app/Models/DashboardActivity.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DashboardActivity extends Model
{
    protected $table = 'dashboard_activities';
    protected $fillable = [
        'user_id',
        'activity_type',
        'reference_id',
        'title',
        'description',
        'icon',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

#### DashboardNotification Model

```php
// app/Models/DashboardNotification.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DashboardNotification extends Model
{
    protected $table = 'dashboard_notifications';
    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'action_url',
        'is_read',
        'expires_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'created_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function markAsRead(): void
    {
        $this->update(['is_read' => true]);
    }
}
```

### 2. Database Migrations

```php
// database/migrations/2026_01_27_create_dashboard_tables.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->enum('activity_type', ['booking', 'lesson', 'review', 'payment', 'achievement']);
            $table->uuid('reference_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->index(['user_id', 'created_at']);
            $table->index('activity_type');
        });

        Schema::create('dashboard_notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('title');
            $table->text('message');
            $table->enum('type', ['info', 'warning', 'alert', 'success'])->default('info');
            $table->string('action_url')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('created_at');
            $table->timestamp('expires_at')->nullable();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->index(['user_id', 'is_read']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_notifications');
        Schema::dropIfExists('dashboard_activities');
    }
};
```

### 3. DashboardService

```php
// app/Services/DashboardService.php
<?php

namespace App\Services;

use App\Models\User;
use App\Models\DashboardActivity;
use Illuminate\Support\Collection;

class DashboardService
{
    public function getCoachDashboard(User $user): array
    {
        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => 'COACH',
                'avatar' => $user->profile_photo_url,
                'rating' => $this->getCoachRating($user),
            ],
            'metrics' => $this->calculateCoachMetrics($user),
            'upcomingLessons' => $this->getUpcomingLessons($user),
            'studentProgress' => $this->getStudentProgress($user),
            'earningsData' => $this->getEarningsData($user),
            'activityFeed' => $this->generateActivityFeed($user, 5),
            'notifications' => $this->getNotifications($user, 5),
        ];
    }

    private function calculateCoachMetrics(User $user): array
    {
        $activeStudents = $user->students()
            ->where('status', 'active')
            ->distinct()
            ->count();

        $monthlyEarnings = $this->getMonthlyEarnings($user);
        $completionRate = $this->getCompletionRate($user);
        $upcomingLessons = $user->lessons()
            ->where('scheduled_date', '>=', now())
            ->count();

        return [
            'activeStudents' => $activeStudents,
            'monthlyEarnings' => $monthlyEarnings,
            'completionRate' => $completionRate,
            'upcomingLessons' => $upcomingLessons,
            'totalRating' => $this->getCoachRating($user),
            'totalLessonsGiven' => $user->lessons()->where('status', 'completed')->count(),
        ];
    }

    private function getUpcomingLessons(User $user): array
    {
        return $user->lessons()
            ->where('scheduled_date', '>=', now())
            ->orderBy('scheduled_date')
            ->limit(5)
            ->get()
            ->map(function ($lesson) {
                return [
                    'id' => $lesson->id,
                    'type' => 'lesson',
                    'title' => 'Lesson with ' . $lesson->student->name,
                    'subtitle' => $lesson->level,
                    'student' => $lesson->student->name,
                    'date' => $lesson->scheduled_date->toIso8601String(),
                    'duration' => $lesson->duration,
                    'status' => $lesson->status,
                    'court' => $lesson->court?->name,
                    'icon' => 'calendar',
                ];
            })
            ->toArray();
    }

    private function getStudentProgress(User $user): array
    {
        return $user->students()
            ->limit(5)
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'lessonsCompleted' => $student->lessons()
                        ->where('coach_id', $user->id)
                        ->where('status', 'completed')
                        ->count(),
                    'skillLevel' => $student->skill_level ?? 'beginner',
                    'rating' => $this->getStudentRating($student, $user),
                    'joinedDate' => $student->pivot->created_at?->toDateString(),
                ];
            })
            ->toArray();
    }

    private function getEarningsData(User $user): array
    {
        $currentMonth = now()->startOfMonth();
        $months = collect();

        for ($i = 0; $i < 6; $i++) {
            $month = $currentMonth->copy()->subMonths($i);
            $monthlyTotal = $user->lessons()
                ->whereYear('scheduled_date', $month->year)
                ->whereMonth('scheduled_date', $month->month)
                ->where('status', 'completed')
                ->sum('rate');

            $months->prepend([
                'month' => $month->format('MMM'),
                'earnings' => $monthlyTotal,
            ]);
        }

        return $months->toArray();
    }

    private function generateActivityFeed(User $user, int $limit = 5): array
    {
        return DashboardActivity::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'type' => $activity->activity_type,
                    'title' => $activity->title,
                    'description' => $activity->description,
                    'timestamp' => $activity->created_at->toIso8601String(),
                    'icon' => $activity->icon ?? 'info-circle',
                    'color' => $this->getActivityColor($activity->activity_type),
                ];
            })
            ->toArray();
    }

    private function getNotifications(User $user, int $limit = 5): array
    {
        return $user->notifications()
            ->whereNull('expires_at')
            ->orWhere('expires_at', '>', now())
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'type' => $notification->type,
                    'isRead' => $notification->is_read,
                    'actionUrl' => $notification->action_url,
                    'createdAt' => $notification->created_at->toIso8601String(),
                ];
            })
            ->toArray();
    }

    private function getMonthlyEarnings(User $user): float
    {
        return (float) $user->lessons()
            ->where('scheduled_date', '>=', now()->startOfMonth())
            ->where('status', 'completed')
            ->sum('rate');
    }

    private function getCompletionRate(User $user): float
    {
        $total = $user->lessons()->count();
        if ($total === 0) return 0;

        $completed = $user->lessons()->where('status', 'completed')->count();
        return round(($completed / $total) * 100, 2);
    }

    private function getCoachRating(User $user): float
    {
        return (float) $user->reviews()
            ->avg('rating') ?? 0;
    }

    private function getStudentRating(User $student, User $coach): ?float
    {
        $review = $student->lessons()
            ->where('coach_id', $coach->id)
            ->whereHas('reviews')
            ->first()?->reviews()
            ->first();

        return $review?->rating;
    }

    private function getActivityColor(string $type): string
    {
        return match ($type) {
            'booking' => 'blue',
            'lesson' => 'emerald',
            'review' => 'amber',
            'payment' => 'green',
            'achievement' => 'purple',
            default => 'slate',
        };
    }
}
```

### 4. DashboardController

```php
// app/Http/Controllers/DashboardController.php
<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $dashboardService)
    {
    }

    public function getCoachDashboard(): JsonResponse
    {
        $user = Auth::user();

        // Verify user has coach role
        if (!$user->hasRole('COACH')) {
            return response()->json([
                'error' => true,
                'code' => 'PERMISSION_DENIED',
                'message' => 'Only coaches can access this dashboard',
            ], 403);
        }

        try {
            $dashboardData = $this->dashboardService->getCoachDashboard($user);
            return response()->json($dashboardData);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'code' => 'INTERNAL_ERROR',
                'message' => 'Failed to retrieve dashboard data',
            ], 500);
        }
    }
}
```

### 5. API Routes

```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard/coach', [DashboardController::class, 'getCoachDashboard']);
});
```

---

## 📱 FRONTEND IMPLEMENTATION

### 1. TypeScript Types

```typescript
// src/types/coach-dashboard.ts

export enum ActivityType {
  LESSON = 'lesson',
  BOOKING = 'booking',
  REVIEW = 'review',
  PAYMENT = 'payment',
  ACHIEVEMENT = 'achievement',
}

export interface CoachUser {
  id: string;
  name: string;
  role: 'COACH';
  avatar?: string;
  rating: number;
}

export interface CoachMetrics {
  activeStudents: number;
  monthlyEarnings: number;
  completionRate: number;
  upcomingLessons: number;
  totalRating: number;
  totalLessonsGiven: number;
}

export interface UpcomingLesson {
  id: string;
  type: 'lesson';
  title: string;
  subtitle: string;
  student: string;
  date: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  court?: string;
  icon: string;
}

export interface StudentProgress {
  id: string;
  name: string;
  lessonsCompleted: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  joinedDate: string;
}

export interface EarningsDataPoint {
  month: string;
  earnings: number;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  
  timestamp: string;
  icon: string;
  color: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface CoachDashboardData {
  user: CoachUser;
  metrics: CoachMetrics;
  upcomingLessons: UpcomingLesson[];
  studentProgress: StudentProgress[];
  earningsData: EarningsDataPoint[];
  activityFeed: ActivityItem[];
  notifications: Notification[];
}
```

### 2. API Service

```typescript
// src/services/api/coach-dashboard.ts

import axios from 'axios';
import { CoachDashboardData } from '@/types/coach-dashboard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const coachDashboardApi = {
  getCoachDashboard: async (): Promise<CoachDashboardData> => {
    const { data } = await apiClient.get('/dashboard/coach');
    return data;
  },

  updateAvailability: async (available: boolean): Promise<{ success: boolean }> => {
    const { data } = await apiClient.post('/coach/availability', { available });
    return data;
  },

  markNotificationAsRead: async (notificationId: string): Promise<{ success: boolean }> => {
    const { data } = await apiClient.post(`/notifications/${notificationId}/read`);
    return data;
  },
};
```

### 3. Custom Hook

```typescript
// src/hooks/useCoachDashboard.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coachDashboardApi } from '@/services/api/coach-dashboard';
import { CoachDashboardData } from '@/types/coach-dashboard';

export function useCoachDashboard() {
  return useQuery({
    queryKey: ['coach-dashboard'],
    queryFn: () => coachDashboardApi.getCoachDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 60 * 1000, // 30 minutes auto-refresh
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (available: boolean) => coachDashboardApi.updateAvailability(available),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-dashboard'] });
    },
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => coachDashboardApi.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-dashboard'] });
    },
  });
}
```

### 4. Shared Components

```typescript
// src/components/dashboard/shared/MetricsCard.tsx

import React from 'react';
import { Card } from '../ui/Common';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  onClick?: () => void;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  color = 'emerald',
  trend,
}) => {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase">{title}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
          {trend && (
            <p className={`text-xs ${trend.direction === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
```

```typescript
// src/components/dashboard/shared/ActivityFeed.tsx

import React from 'react';
import { Card } from '../ui/Common';
import { ActivityItem } from '@/types/coach-dashboard';

interface ActivityFeedProps {
  items: ActivityItem[];
  maxItems?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ items, maxItems = 5 }) => {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Activity</h3>
      <div className="space-y-3">
        {items.slice(0, maxItems).map((item) => (
          <div key={item.id} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-${item.color}-50 text-${item.color}-600`}>
              ●
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">{item.title}</p>
              <p className="text-xs text-slate-500">{item.description}</p>
              <p className="text-xs text-slate-400 mt-0.5">{new Date(item.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
```

### 5. Coach Dashboard Main Component

```typescript
// src/components/dashboard/coach/CoachDashboard.tsx

import React from 'react';
import { useCoachDashboard } from '@/hooks/useCoachDashboard';
import { Card } from '@/components/ui/Common';
import { MetricsCard } from '../shared/MetricsCard';
import { ActivityFeed } from '../shared/ActivityFeed';
import { LessonSchedule } from './LessonSchedule';
import { StudentOverview } from './StudentOverview';
import { EarningsMetrics } from './EarningsMetrics';
import { AvailabilityWidget } from './AvailabilityWidget';
import { Calendar, Users, DollarSign, TrendingUp, CheckCircle, Star } from 'lucide-react';

export const CoachDashboard: React.FC = () => {
  const { data: dashboard, isLoading, error } = useCoachDashboard();

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-24 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 bg-rose-50 border border-rose-100">
        <p className="text-sm font-bold text-rose-800">Failed to load dashboard</p>
        <p className="text-xs text-rose-600">{(error as Error).message}</p>
      </Card>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="space-y-4 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {dashboard.user.name}!</h1>
            <p className="text-emerald-100 text-sm mt-1">Manage your coaching and student progress</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-lg font-bold">{dashboard.metrics.totalRating.toFixed(1)}</span>
            </div>
            <p className="text-xs text-emerald-100">Coach Rating</p>
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <MetricsCard
          title="Active Students"
          value={dashboard.metrics.activeStudents}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <MetricsCard
          title="Monthly Earnings"
          value={`₱${dashboard.metrics.monthlyEarnings.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
          color="emerald"
        />
        <MetricsCard
          title="Completion Rate"
          value={`${dashboard.metrics.completionRate}%`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="amber"
        />
        <MetricsCard
          title="Upcoming Lessons"
          value={dashboard.metrics.upcomingLessons}
          icon={<Calendar className="w-5 h-5" />}
          color="purple"
        />
        <MetricsCard
          title="Total Lessons"
          value={dashboard.metrics.totalLessonsGiven}
          icon={<TrendingUp className="w-5 h-5" />}
          color="rose"
        />
        <AvailabilityWidget />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Lessons & Students */}
        <div className="lg:col-span-2 space-y-4">
          <LessonSchedule lessons={dashboard.upcomingLessons} />
          <StudentOverview students={dashboard.studentProgress} />
        </div>

        {/* Right Column - Earnings & Activity */}
        <div className="space-y-4">
          <EarningsMetrics earningsData={dashboard.earningsData} />
          <ActivityFeed items={dashboard.activityFeed} maxItems={4} />
        </div>
      </div>

      {/* Notifications */}
      {dashboard.notifications.length > 0 && (
        <Card className="p-4 border-l-4 border-l-blue-500">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Recent Notifications</h3>
          <div className="space-y-2">
            {dashboard.notifications.slice(0, 3).map((notif) => (
              <div key={notif.id} className="flex gap-2 p-2 bg-blue-50 rounded">
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                  <p className="text-xs text-slate-500">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
```

### 6. Coach Dashboard Sub-Components

```typescript
// src/components/dashboard/coach/LessonSchedule.tsx

import React from 'react';
import { Card, Badge } from '@/components/ui/Common';
import { UpcomingLesson } from '@/types/coach-dashboard';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface LessonScheduleProps {
  lessons: UpcomingLesson[];
}

export const LessonSchedule: React.FC<LessonScheduleProps> = ({ lessons }) => {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
        <Calendar className="w-4 h-4 text-emerald-600" />
        Upcoming Lessons
      </h3>
      <div className="space-y-2">
        {lessons.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No upcoming lessons</p>
        ) : (
          lessons.map((lesson) => (
            <div key={lesson.id} className="flex gap-3 p-3 border border-slate-100 rounded-lg hover:border-emerald-300 transition-colors">
              <div className="pt-0.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">{lesson.student}</p>
                <p className="text-xs text-slate-500">{lesson.title}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs text-slate-600 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {lesson.duration} min
                  </span>
                  {lesson.court && (
                    <span className="text-xs text-slate-600 flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />
                      {lesson.court}
                    </span>
                  )}
                </div>
              </div>
              <Badge className={lesson.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'} >
                {lesson.status}
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
```

```typescript
// src/components/dashboard/coach/StudentOverview.tsx

import React from 'react';
import { Card, Badge } from '@/components/ui/Common';
import { StudentProgress } from '@/types/coach-dashboard';
import { Users, Star } from 'lucide-react';

interface StudentOverviewProps {
  students: StudentProgress[];
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({ students }) => {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
        <Users className="w-4 h-4 text-blue-600" />
        Student Progress
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-3 py-2 font-bold text-slate-600">Student</th>
              <th className="px-3 py-2 font-bold text-slate-600">Level</th>
              <th className="px-3 py-2 font-bold text-slate-600">Lessons</th>
              <th className="px-3 py-2 font-bold text-slate-600">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50">
                <td className="px-3 py-2">
                  <p className="font-bold text-slate-900">{student.name}</p>
                  <p className="text-slate-400">{new Date(student.joinedDate).toLocaleDateString()}</p>
                </td>
                <td className="px-3 py-2">
                  <Badge className="bg-blue-50 text-blue-700">{student.skillLevel}</Badge>
                </td>
                <td className="px-3 py-2 font-bold text-slate-900">{student.lessonsCompleted}</td>
                <td className="px-3 py-2">
                  {student.rating ? (
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-500" />
                      <span className="font-bold">{student.rating}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
```

```typescript
// src/components/dashboard/coach/EarningsMetrics.tsx

import React from 'react';
import { Card } from '@/components/ui/Common';
import { EarningsDataPoint } from '@/types/coach-dashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';

interface EarningsMetricsProps {
  earningsData: EarningsDataPoint[];
}

export const EarningsMetrics: React.FC<EarningsMetricsProps> = ({ earningsData }) => {
  const totalEarnings = earningsData.reduce((sum, point) => sum + point.earnings, 0);
  const maxEarnings = Math.max(...earningsData.map((d) => d.earnings), 1);

  return (
    <Card className="p-4">
      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
        <DollarSign className="w-4 h-4 text-emerald-600" />
        Earnings (6 Months)
      </h3>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                fontSize: '11px',
              }}
              formatter={(value) => `₱${value.toLocaleString()}`}
            />
            <Line 
              type="monotone" 
              dataKey="earnings" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-500">Total (6 months)</p>
        <p className="text-lg font-bold text-slate-900">₱{totalEarnings.toLocaleString()}</p>
      </div>
    </Card>
  );
};
```

```typescript
// src/components/dashboard/coach/AvailabilityWidget.tsx

import React from 'react';
import { Card } from '@/components/ui/Common';
import { useUpdateAvailability } from '@/hooks/useCoachDashboard';
import { CheckCircle, Clock } from 'lucide-react';

export const AvailabilityWidget: React.FC = () => {
  const [isAvailable, setIsAvailable] = React.useState(true);
  const updateAvailability = useUpdateAvailability();

  const handleToggle = async () => {
    setIsAvailable(!isAvailable);
    await updateAvailability.mutateAsync(!isAvailable);
  };

  return (
    <Card className="p-4 col-span-2">
      <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Availability</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAvailable ? (
            <>
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-bold text-emerald-700">Available</span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 rounded-full bg-slate-400" />
              <span className="text-sm font-bold text-slate-700">Unavailable</span>
            </>
          )}
        </div>
        <button
          onClick={handleToggle}
          className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
            isAvailable
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {isAvailable ? 'Set Busy' : 'Set Available'}
        </button>
      </div>
    </Card>
  );
};
```

---

## 📊 COMPONENT BREAKDOWN

| Component | Purpose | Lines | Priority |
|-----------|---------|-------|----------|
| CoachDashboard.tsx | Main layout & orchestration | 120 | HIGH |
| LessonSchedule.tsx | Display upcoming lessons | 60 | HIGH |
| StudentOverview.tsx | List students with progress | 65 | HIGH |
| EarningsMetrics.tsx | Show earnings chart & totals | 70 | HIGH |
| AvailabilityWidget.tsx | Toggle availability status | 45 | MEDIUM |
| MetricsCard.tsx | Reusable KPI card | 45 | HIGH |
| ActivityFeed.tsx | Recent activity list | 60 | MEDIUM |
| useCoachDashboard.ts | React Query hook | 35 | HIGH |
| coachDashboardApi.ts | API service layer | 40 | HIGH |
| DashboardService.php | Backend calculations | 180 | HIGH |
| DashboardController.php | Laravel endpoint | 35 | HIGH |

---

## 🔌 API CONTRACT

### Get Coach Dashboard

```http
GET /api/dashboard/coach
Authorization: Bearer {access_token}
```

**Response: 200 OK**

```json
{
  "user": {
    "id": "coach-uuid-123",
    "name": "Maria Santos",
    "role": "COACH",
    "avatar": "https://...",
    "rating": 4.9
  },
  "metrics": {
    "activeStudents": 12,
    "monthlyEarnings": 45000,
    "completionRate": 95.5,
    "upcomingLessons": 5,
    "totalRating": 4.9,
    "totalLessonsGiven": 156
  },
  "upcomingLessons": [
    {
      "id": "lesson-1",
      "type": "lesson",
      "title": "Lesson with John Player",
      "subtitle": "Advanced Techniques",
      "student": "John Player",
      "date": "2026-01-28T10:00:00Z",
      "duration": 60,
      "status": "confirmed",
      "court": "BGC Pickleball Courts",
      "icon": "calendar"
    }
  ],
  "studentProgress": [
    {
      "id": "student-1",
      "name": "John Player",
      "lessonsCompleted": 12,
      "skillLevel": "intermediate",
      "rating": 4.8,
      "joinedDate": "2025-11-15"
    }
  ],
  "earningsData": [
    { "month": "Aug", "earnings": 35000 },
    { "month": "Sep", "earnings": 42000 },
    { "month": "Oct", "earnings": 38000 },
    { "month": "Nov", "earnings": 45000 },
    { "month": "Dec", "earnings": 48000 },
    { "month": "Jan", "earnings": 45000 }
  ],
  "activityFeed": [
    {
      "id": "activity-1",
      "type": "lesson",
      "title": "Lesson Completed",
      "description": "Finished lesson with John Player",
      "timestamp": "2026-01-26T14:30:00Z",
      "icon": "check-circle",
      "color": "emerald"
    }
  ],
  "notifications": [
    {
      "id": "notif-1",
      "title": "New Lesson Booking",
      "message": "Jane Smith booked a lesson for Jan 30",
      "type": "info",
      "isRead": false,
      "actionUrl": "/coach/bookings",
      "createdAt": "2026-01-27T10:00:00Z"
    }
  ]
}
```

---

## 📦 MOCK DATA

```typescript
// src/lib/coach-dashboard-constants.ts

export const MOCK_COACH_DASHBOARD = {
  user: {
    id: 'coach-1',
    name: 'Maria Santos',
    role: 'COACH',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    rating: 4.9,
  },
  metrics: {
    activeStudents: 12,
    monthlyEarnings: 45000,
    completionRate: 95.5,
    upcomingLessons: 5,
    totalRating: 4.9,
    totalLessonsGiven: 156,
  },
  upcomingLessons: [
    {
      id: 'lesson-1',
      type: 'lesson',
      title: 'Lesson with John Player',
      subtitle: 'Advanced Techniques',
      student: 'John Player',
      date: new Date(2026, 0, 28, 10, 0).toISOString(),
      duration: 60,
      status: 'confirmed',
      court: 'BGC Pickleball Courts',
      icon: 'calendar',
    },
    {
      id: 'lesson-2',
      type: 'lesson',
      title: 'Group Class',
      subtitle: 'Beginner Session',
      student: '4 Students',
      date: new Date(2026, 0, 29, 14, 0).toISOString(),
      duration: 90,
      status: 'confirmed',
      court: 'Makati Courts',
      icon: 'users',
    },
  ],
  studentProgress: [
    {
      id: 'student-1',
      name: 'John Player',
      lessonsCompleted: 12,
      skillLevel: 'intermediate',
      rating: 4.8,
      joinedDate: '2025-11-15',
    },
    {
      id: 'student-2',
      name: 'Jane Smith',
      lessonsCompleted: 8,
      skillLevel: 'beginner',
      rating: 5,
      joinedDate: '2025-12-01',
    },
  ],
  earningsData: [
    { month: 'Aug', earnings: 35000 },
    { month: 'Sep', earnings: 42000 },
    { month: 'Oct', earnings: 38000 },
    { month: 'Nov', earnings: 45000 },
    { month: 'Dec', earnings: 48000 },
    { month: 'Jan', earnings: 45000 },
  ],
  activityFeed: [
    {
      id: 'activity-1',
      type: 'lesson',
      title: 'Lesson Completed',
      description: 'Finished lesson with John Player',
      timestamp: new Date(2026, 0, 26, 14, 30).toISOString(),
      icon: 'check-circle',
      color: 'emerald',
    },
  ],
  notifications: [
    {
      id: 'notif-1',
      title: 'New Lesson Booking',
      message: 'Jane Smith booked a lesson for Jan 30',
      type: 'info',
      isRead: false,
      actionUrl: '/coach/bookings',
      createdAt: new Date(2026, 0, 27, 10, 0).toISOString(),
    },
  ],
};
```

---

## 💾 DATABASE SCHEMA

Run the migration:
```bash
php artisan migrate
```

Tables created:
- `dashboard_activities` - Tracks coach activities
- `dashboard_notifications` - Stores notifications for coaches

---

## 🚀 IMPLEMENTATION STEPS

### Step 1: Backend Setup (Day 1)
1. Create migration file
2. Create Models (DashboardActivity, DashboardNotification)
3. Create DashboardService
4. Create DashboardController
5. Add API route
6. Test with Postman

### Step 2: Frontend Setup (Day 2)
1. Create types/coach-dashboard.ts
2. Create services/api/coach-dashboard.ts
3. Create hooks/useCoachDashboard.ts
4. Create dashboard folder structure

### Step 3: Build Shared Components (Day 3)
1. MetricsCard.tsx
2. ActivityFeed.tsx
3. Test with mock data

### Step 4: Build Coach Dashboard Components (Day 4)
1. CoachDashboard.tsx
2. LessonSchedule.tsx
3. StudentOverview.tsx
4. EarningsMetrics.tsx
5. AvailabilityWidget.tsx

### Step 5: Integration & Testing (Day 5)
1. Connect to real API
2. Test all flows
3. Error handling
4. Loading states
5. Responsive design

---

**Ready to implement!**
