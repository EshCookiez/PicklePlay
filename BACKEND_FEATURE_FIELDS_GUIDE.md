# Backend Feature Fields Guide

> **Purpose:** This document provides detailed field specifications for each feature category in the PicklePlay backend. Use this as a reference when implementing new features or extending existing ones.

---

## **TABLE OF CONTENTS**

1. [Authentication & User Management](#authentication--user-management)
2. [Court Management](#court-management)
3. [Court Booking System](#court-booking-system)
4. [Location & Map Features](#location--map-features)
5. [Search & Filter Engine](#search--filter-engine)
6. [Shop/Merchandise](#shopmerchandise)
7. [Payment Processing](#payment-processing)
8. [Events & News](#events--news)
9. [Tournaments System](#tournaments-system)
10. [Coaching System](#coaching-system)
11. [Rankings & Points System](#rankings--points-system)
12. [Community Features](#community-features)
13. [Reviews & Ratings](#reviews--ratings)
14. [Admin Dashboard](#admin-dashboard)
15. [Integrations](#integrations)
16. [Data Management & Export](#data-management--export)
17. [Analytics & Logging](#analytics--logging)
18. [Player Profile System](#player-profile-system)

---

## **AUTHENTICATION & USER MANAGEMENT**

### **Users Table Fields**

#### **Required Fields (Registration)**
```php
// Basic Credentials
'email'                     => 'string|unique|email:rfc,dns|max:255'
'password'                  => 'string|min:8|mixedCase|numbers|symbols'
'first_name'                => 'string|max:255'
'last_name'                 => 'string|max:255'
'date_of_birth'             => 'date|before:-18 years'

// Optional at Registration
'phone_number'              => 'nullable|string|max:20'
'location'                  => 'nullable|string|max:255'
```

#### **System Fields (Auto-Generated)**
```php
'id'                        => 'uuid|primary'
'role'                      => 'enum:user,coach,admin,super_admin,court_owner'
'status'                    => 'enum:active,inactive,suspended'
'email_verified_at'         => 'timestamp|nullable'
'phone_verified_at'         => 'timestamp|nullable'
'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
'last_login_at'             => 'timestamp|nullable'
'last_password_change_at'   => 'timestamp|nullable'
'login_count'               => 'integer|default:0'
'last_ip_address'           => 'string|nullable'
```

#### **Security Fields**
```php
'email_verification_token'           => 'string|nullable'
'email_verification_token_expires_at'=> 'timestamp|nullable'
'two_factor_enabled'                 => 'boolean|default:false'
'two_factor_method'                  => 'enum:sms,email,app|nullable'
'two_factor_backup_codes'            => 'json|nullable'
'remember_token'                     => 'string|nullable'
```

#### **Financial Fields**
```php
'stripe_customer_id'        => 'string|nullable'
'wallet_balance'            => 'decimal:10,2|default:0.00'
'total_spent'               => 'decimal:10,2|default:0.00'
'total_earnings'            => 'decimal:10,2|default:0.00'
```

#### **Profile Fields**
```php
'profile_picture'           => 'string|nullable' // Path to storage
```

---

### **User Profiles Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id|unique'

// Profile Information
'profile_photo'             => 'string|nullable'
'bio'                       => 'text|max:500|nullable'
'gender'                    => 'enum:male,female,non_binary,prefer_not_to_say|nullable'
'cover_photo'               => 'string|nullable'

// Social Links
'instagram_url'             => 'string|url|max:255|nullable'
'linkedin_url'              => 'string|url|max:255|nullable'
'twitter_url'               => 'string|url|max:255|nullable'
'website_url'               => 'string|url|max:255|nullable'

// Address
'street_address'            => 'string|max:255|nullable'
'city'                      => 'string|max:255|nullable'
'state_province'            => 'string|max:255|nullable'
'country'                   => 'string|max:255|nullable'
'postal_code'               => 'string|max:20|nullable'
'latitude'                  => 'decimal:10,8|between:-90,90|nullable'
'longitude'                 => 'decimal:11,8|between:-180,180|nullable'

// Professional Information
'title_occupation'          => 'string|max:255|nullable'
'company_organization'      => 'string|max:255|nullable'
'years_in_sport'            => 'integer|min:0|nullable'
'certifications'            => 'json|nullable' // Array of certification objects

// Billing Address
'billing_street_address'    => 'string|max:255|nullable'
'billing_city'              => 'string|max:255|nullable'
'billing_state_province'    => 'string|max:255|nullable'
'billing_country'           => 'string|max:255|nullable'
'billing_postal_code'       => 'string|max:20|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **User Preferences Table Fields**

```php
'id'                                => 'bigint|primary|auto_increment'
'user_id'                           => 'uuid|foreign:users.id|unique'

// Localization
'preferred_language'                => 'string|max:10|default:en'
'timezone'                          => 'string|max:50|default:UTC'

// Privacy
'privacy_level'                     => 'enum:public,private,friends_only|default:public'

// Email Notifications
'email_booking_confirmations'       => 'boolean|default:true'
'email_lesson_reminders'            => 'boolean|default:true'
'email_marketing'                   => 'boolean|default:false'
'email_frequency'                   => 'enum:immediate,daily,weekly|default:immediate'

// Other Notifications
'push_notifications_enabled'        => 'boolean|default:true'
'sms_notifications_enabled'         => 'boolean|default:false'

'created_at'                        => 'timestamp'
'updated_at'                        => 'timestamp'
```

---

### **User Statistics Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id|unique'

// Booking Statistics
'total_bookings_made'       => 'integer|default:0'

// Lesson Statistics
'total_lessons_taken'       => 'integer|default:0'
'total_lessons_given'       => 'integer|default:0'

// Rating & Reviews
'average_rating_received'   => 'decimal:3,2|default:0.00'
'total_review_count'        => 'integer|default:0'

// Tournament Statistics
'tournament_participations' => 'integer|default:0'
'tournament_wins'           => 'integer|default:0'
'current_ranking'           => 'integer|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **Authentication Logs Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id|nullable'
'email'                     => 'string|max:255'
'action'                    => 'string|max:50' // login, logout, register, password_change, etc.
'status'                    => 'enum:success,failed'
'ip_address'                => 'string|max:45|nullable'
'user_agent'                => 'text|nullable'
'details'                   => 'text|nullable'
'created_at'                => 'timestamp'
```

---

### **Role Applications Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id'
'role_applied_for'          => 'enum:coach,court_owner,organizer'
'status'                    => 'enum:pending,approved,rejected|default:pending'

// Application Details
'business_name'             => 'string|max:255|nullable' // For court owners
'business_registration'     => 'string|max:255|nullable'
'certifications'            => 'json|nullable' // For coaches
'experience_years'          => 'integer|nullable'
'description'               => 'text' // Why they want this role

// Documents
'documents'                 => 'json|nullable' // Array of document paths
'id_verification'           => 'string|nullable'

// Review
'reviewed_by'               => 'uuid|foreign:users.id|nullable'
'reviewed_at'               => 'timestamp|nullable'
'rejection_reason'          => 'text|nullable'
'admin_notes'               => 'text|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

## **COURT MANAGEMENT**

### **Courts Table Fields**

#### **Required Fields**
```php
'id'                        => 'bigint|primary|auto_increment'
'owner_id'                  => 'uuid|foreign:users.id'
'name'                      => 'string|max:255'
'description'               => 'text|nullable'
'type'                      => 'enum:indoor,outdoor,both'
'surface'                   => 'enum:concrete,asphalt,sport_court,wood,other'
'address'                   => 'string|max:500'
'city'                      => 'string|max:255'
'country'                   => 'string|max:255'
'number_of_courts'          => 'integer|min:1'
```

#### **Location Fields**
```php
'state_province'            => 'string|max:255|nullable'
'postal_code'               => 'string|max:20|nullable'
'latitude'                  => 'decimal:10,8|between:-90,90|nullable'
'longitude'                 => 'decimal:11,8|between:-180,180|nullable'
```

#### **Amenities & Features**
```php
'amenities'                 => 'json|nullable' // Array: ['parking', 'restrooms', 'water', 'lighting', 'seating', 'pro_shop', 'locker_rooms']
'hours_of_operation'        => 'json|nullable' // Object: { "monday": "6am-10pm", "tuesday": "6am-10pm", ... }
```

#### **Pricing Fields**
```php
'is_free'                   => 'boolean|default:false'
'price_per_hour'            => 'decimal:8,2|nullable'
'peak_hour_price'           => 'decimal:8,2|nullable'
'currency'                  => 'string|max:3|default:USD'
```

#### **Contact Information**
```php
'phone_number'              => 'string|max:20|nullable'
'email'                     => 'string|email|max:255|nullable'
'website'                   => 'string|url|max:255|nullable'
'booking_url'               => 'string|url|max:255|nullable'
'requires_booking'          => 'boolean|default:false'
```

#### **Media Fields**
```php
'images'                    => 'json|nullable' // Array of image paths
'cover_image'               => 'string|nullable'
```

#### **Status & Approval**
```php
'status'                    => 'enum:pending,approved,rejected,suspended|default:pending'
'approved_by'               => 'uuid|foreign:users.id|nullable'
'approved_at'               => 'timestamp|nullable'
'rejection_reason'          => 'text|nullable'
```

#### **Statistics**
```php
'view_count'                => 'integer|default:0'
'total_bookings'            => 'integer|default:0'
'rating'                    => 'decimal:3,2|default:0.00'
'review_count'              => 'integer|default:0'
```

#### **Visibility**
```php
'is_active'                 => 'boolean|default:true'
'is_featured'               => 'boolean|default:false'
```

#### **Timestamps**
```php
'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
'deleted_at'                => 'timestamp|nullable' // Soft delete
```

---

## **COURT BOOKING SYSTEM**

### **Bookings Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id'
'court_id'                  => 'bigint|foreign:courts.id'

// Booking Details
'booking_date'              => 'date'
'start_time'                => 'time'
'end_time'                  => 'time'
'duration_hours'            => 'decimal:4,2'

// Participants
'number_of_players'         => 'integer|min:1|max:4'
'player_names'              => 'json|nullable' // Array of player names

// Pricing
'price_per_hour'            => 'decimal:8,2'
'total_price'               => 'decimal:8,2'
'currency'                  => 'string|max:3|default:USD'

// Status
'status'                    => 'enum:pending,confirmed,cancelled,completed,no_show'
'payment_status'            => 'enum:unpaid,paid,refunded,partially_refunded'

// Cancellation
'cancelled_at'              => 'timestamp|nullable'
'cancellation_reason'       => 'text|nullable'
'cancelled_by'              => 'uuid|foreign:users.id|nullable'

// Notes
'special_requests'          => 'text|nullable'
'admin_notes'               => 'text|nullable'

// Confirmation
'confirmation_code'         => 'string|unique|max:20'
'confirmed_at'              => 'timestamp|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **Availability Slots Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'court_id'                  => 'bigint|foreign:courts.id'
'day_of_week'               => 'enum:monday,tuesday,wednesday,thursday,friday,saturday,sunday'
'start_time'                => 'time'
'end_time'                  => 'time'
'is_available'              => 'boolean|default:true'
'price_per_hour'            => 'decimal:8,2|nullable'
'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

## **PLAYER PROFILE SYSTEM**

### **Player Profiles Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id|unique'

// Skill Information
'skill_level'               => 'enum:beginner,intermediate,advanced,professional|default:beginner'
'years_of_experience'       => 'integer|min:0|default:0'
'playing_style'             => 'enum:aggressive,defensive,balanced,all_around|nullable'

// Playing Preferences
'preferred_hand'            => 'enum:right,left,ambidextrous|nullable'
'preferred_position'        => 'enum:singles,doubles,both|default:both'
'preferred_time'            => 'json|nullable' // Array: ['morning', 'afternoon', 'evening']

// Certifications & Achievements
'certifications'            => 'json|nullable' // Array of certification objects
'achievements'              => 'json|nullable' // Array of achievement objects
'tournament_history'        => 'json|nullable' // Array of tournament records

// Availability
'availability_schedule'     => 'json|nullable' // Object: { "monday": ["9am-12pm", "6pm-9pm"], ... }
'is_available_for_lessons'  => 'boolean|default:false'
'lesson_rate_per_hour'      => 'decimal:8,2|nullable'

// Court Preferences
'preferred_court_type'      => 'enum:indoor,outdoor,both|nullable'
'preferred_surface'         => 'enum:concrete,asphalt,sport_court,wood|nullable'
'max_travel_distance_km'    => 'integer|nullable'

// Profile Completion
'profile_completion_percentage' => 'integer|default:0'

// Media
'profile_photo'             => 'string|nullable'
'action_photos'             => 'json|nullable' // Array of photo paths

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

## **SHOP/MERCHANDISE**

### **Products Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'name'                      => 'string|max:255'
'slug'                      => 'string|unique|max:255'
'description'               => 'text|nullable'
'short_description'         => 'string|max:500|nullable'

// Category & Type
'category'                  => 'enum:paddles,balls,apparel,accessories,equipment,other'
'subcategory'               => 'string|max:100|nullable'
'brand'                     => 'string|max:100|nullable'

// Pricing
'price'                     => 'decimal:10,2'
'sale_price'                => 'decimal:10,2|nullable'
'currency'                  => 'string|max:3|default:USD'
'cost_price'                => 'decimal:10,2|nullable' // For profit calculation

// Inventory
'sku'                       => 'string|unique|max:100'
'stock_quantity'            => 'integer|default:0'
'low_stock_threshold'       => 'integer|default:5'
'is_in_stock'               => 'boolean|default:true'
'track_inventory'           => 'boolean|default:true'

// Product Details
'weight'                    => 'decimal:8,2|nullable' // In grams
'dimensions'                => 'json|nullable' // Object: { "length": 40, "width": 20, "height": 5 }
'color'                     => 'string|max:50|nullable'
'size'                      => 'string|max:50|nullable'
'material'                  => 'string|max:100|nullable'

// Variants
'has_variants'              => 'boolean|default:false'
'variants'                  => 'json|nullable' // Array of variant objects

// Media
'images'                    => 'json|nullable' // Array of image paths
'featured_image'            => 'string|nullable'

// SEO
'meta_title'                => 'string|max:255|nullable'
'meta_description'          => 'string|max:500|nullable'
'meta_keywords'             => 'string|max:255|nullable'

// Status
'status'                    => 'enum:draft,published,archived|default:draft'
'is_featured'               => 'boolean|default:false'
'is_on_sale'                => 'boolean|default:false'

// Statistics
'view_count'                => 'integer|default:0'
'sales_count'               => 'integer|default:0'
'rating'                    => 'decimal:3,2|default:0.00'
'review_count'              => 'integer|default:0'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
'deleted_at'                => 'timestamp|nullable'
```

---

### **Shopping Cart Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id|nullable' // Nullable for guest carts
'session_id'                => 'string|max:255|nullable' // For guest users
'product_id'                => 'bigint|foreign:products.id'
'variant_id'                => 'bigint|nullable' // If product has variants
'quantity'                  => 'integer|min:1|default:1'
'price_at_time'             => 'decimal:10,2' // Price when added to cart
'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **Orders Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'order_number'              => 'string|unique|max:50'
'user_id'                   => 'uuid|foreign:users.id'

// Order Status
'status'                    => 'enum:pending,processing,shipped,delivered,cancelled,refunded'
'payment_status'            => 'enum:unpaid,paid,refunded,partially_refunded'

// Pricing
'subtotal'                  => 'decimal:10,2'
'tax_amount'                => 'decimal:10,2|default:0.00'
'shipping_cost'             => 'decimal:10,2|default:0.00'
'discount_amount'           => 'decimal:10,2|default:0.00'
'total_amount'              => 'decimal:10,2'
'currency'                  => 'string|max:3|default:USD'

// Shipping Information
'shipping_first_name'       => 'string|max:255'
'shipping_last_name'        => 'string|max:255'
'shipping_address'          => 'string|max:500'
'shipping_city'             => 'string|max:255'
'shipping_state'            => 'string|max:255'
'shipping_country'          => 'string|max:255'
'shipping_postal_code'      => 'string|max:20'
'shipping_phone'            => 'string|max:20'
'shipping_email'            => 'string|email|max:255'

// Billing Information
'billing_first_name'        => 'string|max:255'
'billing_last_name'         => 'string|max:255'
'billing_address'           => 'string|max:500'
'billing_city'              => 'string|max:255'
'billing_state'             => 'string|max:255'
'billing_country'           => 'string|max:255'
'billing_postal_code'       => 'string|max:20'

// Payment Information
'payment_method'            => 'string|max:50'
'payment_transaction_id'    => 'string|max:255|nullable'
'paid_at'                   => 'timestamp|nullable'

// Shipping
'shipping_method'           => 'string|max:100|nullable'
'tracking_number'           => 'string|max:255|nullable'
'shipped_at'                => 'timestamp|nullable'
'delivered_at'              => 'timestamp|nullable'

// Notes
'customer_notes'            => 'text|nullable'
'admin_notes'               => 'text|nullable'

// Cancellation/Refund
'cancelled_at'              => 'timestamp|nullable'
'cancellation_reason'       => 'text|nullable'
'refunded_at'               => 'timestamp|nullable'
'refund_amount'             => 'decimal:10,2|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **Order Items Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'order_id'                  => 'bigint|foreign:orders.id'
'product_id'                => 'bigint|foreign:products.id'
'variant_id'                => 'bigint|nullable'

// Product Details (snapshot at time of order)
'product_name'              => 'string|max:255'
'product_sku'               => 'string|max:100'
'variant_details'           => 'json|nullable' // Color, size, etc.

// Pricing
'quantity'                  => 'integer|min:1'
'unit_price'                => 'decimal:10,2'
'subtotal'                  => 'decimal:10,2'
'tax_amount'                => 'decimal:10,2|default:0.00'
'total'                     => 'decimal:10,2'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

## **PAYMENT PROCESSING**

### **Payments Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id'
'payable_type'              => 'string' // Polymorphic: Order, Booking, etc.
'payable_id'                => 'bigint' // Polymorphic ID

// Payment Details
'payment_method'            => 'enum:credit_card,debit_card,paypal,stripe,wallet,cash'
'payment_gateway'           => 'string|max:50' // stripe, paypal, etc.
'transaction_id'            => 'string|unique|max:255'
'gateway_transaction_id'    => 'string|max:255|nullable'

// Amount
'amount'                    => 'decimal:10,2'
'currency'                  => 'string|max:3|default:USD'
'fee_amount'                => 'decimal:10,2|default:0.00'
'net_amount'                => 'decimal:10,2'

// Status
'status'                    => 'enum:pending,processing,completed,failed,refunded,cancelled'
'payment_status'            => 'enum:authorized,captured,refunded,partially_refunded'

// Card Details (if applicable, encrypted)
'card_last_four'            => 'string|max:4|nullable'
'card_brand'                => 'string|max:50|nullable'
'card_exp_month'            => 'integer|nullable'
'card_exp_year'             => 'integer|nullable'

// Timestamps
'authorized_at'             => 'timestamp|nullable'
'captured_at'               => 'timestamp|nullable'
'failed_at'                 => 'timestamp|nullable'
'refunded_at'               => 'timestamp|nullable'

// Error Handling
'error_code'                => 'string|max:50|nullable'
'error_message'             => 'text|nullable'

// Metadata
'metadata'                  => 'json|nullable'
'ip_address'                => 'string|max:45|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **Transactions Log Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id'
'payment_id'                => 'bigint|foreign:payments.id|nullable'

// Transaction Details
'type'                      => 'enum:payment,refund,credit,debit,transfer,fee'
'amount'                    => 'decimal:10,2'
'currency'                  => 'string|max:3|default:USD'
'balance_before'            => 'decimal:10,2'
'balance_after'             => 'decimal:10,2'

// Description
'description'               => 'string|max:500'
'reference_type'            => 'string|nullable' // Polymorphic
'reference_id'              => 'bigint|nullable' // Polymorphic

// Status
'status'                    => 'enum:pending,completed,failed,cancelled'

// Metadata
'metadata'                  => 'json|nullable'

'created_at'                => 'timestamp'
```

---

## **EVENTS & NEWS**

### **Events Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'organizer_id'              => 'uuid|foreign:users.id'
'title'                     => 'string|max:255'
'slug'                      => 'string|unique|max:255'
'description'               => 'text'
'short_description'         => 'string|max:500|nullable'

// Event Type
'type'                      => 'enum:tournament,social,training,clinic,league,other'
'category'                  => 'string|max:100|nullable'

// Date & Time
'start_date'                => 'date'
'end_date'                  => 'date'
'start_time'                => 'time|nullable'
'end_time'                  => 'time|nullable'
'timezone'                  => 'string|max:50'

// Location
'location_type'             => 'enum:physical,online,hybrid'
'venue_name'                => 'string|max:255|nullable'
'address'                   => 'string|max:500|nullable'
'city'                      => 'string|max:255|nullable'
'state'                     => 'string|max:255|nullable'
'country'                   => 'string|max:255|nullable'
'postal_code'               => 'string|max:20|nullable'
'latitude'                  => 'decimal:10,8|nullable'
'longitude'                 => 'decimal:11,8|nullable'
'online_meeting_url'        => 'string|url|max:500|nullable'

// Registration
'registration_required'     => 'boolean|default:false'
'registration_deadline'     => 'datetime|nullable'
'max_participants'          => 'integer|nullable'
'current_participants'      => 'integer|default:0'
'registration_fee'          => 'decimal:10,2|nullable'
'currency'                  => 'string|max:3|default:USD'

// Skill Level
'skill_level_required'      => 'enum:all,beginner,intermediate,advanced,professional|default:all'
'age_restriction'           => 'string|max:100|nullable' // e.g., "18+", "Under 16"

// Media
'featured_image'            => 'string|nullable'
'images'                    => 'json|nullable'

// Status
'status'                    => 'enum:draft,published,cancelled,completed|default:draft'
'is_featured'               => 'boolean|default:false'

// Contact
'contact_email'             => 'string|email|max:255|nullable'
'contact_phone'             => 'string|max:20|nullable'

// Additional Info
'rules'                     => 'text|nullable'
'prizes'                    => 'json|nullable'
'sponsors'                  => 'json|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
'deleted_at'                => 'timestamp|nullable'
```

---

### **Event Registrations Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'event_id'                  => 'bigint|foreign:events.id'
'user_id'                   => 'uuid|foreign:users.id'

// Registration Details
'registration_date'         => 'datetime'
'status'                    => 'enum:pending,confirmed,cancelled,attended,no_show'
'payment_status'            => 'enum:unpaid,paid,refunded|nullable'
'payment_id'                => 'bigint|foreign:payments.id|nullable'

// Participant Info
'team_name'                 => 'string|max:255|nullable'
'partner_name'              => 'string|max:255|nullable'
'partner_email'             => 'string|email|max:255|nullable'

// Additional
'special_requests'          => 'text|nullable'
'dietary_restrictions'      => 'string|max:500|nullable'
'emergency_contact_name'    => 'string|max:255|nullable'
'emergency_contact_phone'   => 'string|max:20|nullable'

// Confirmation
'confirmation_code'         => 'string|unique|max:20'
'confirmed_at'              => 'timestamp|nullable'
'checked_in_at'             => 'timestamp|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **News Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'author_id'                 => 'uuid|foreign:users.id'
'title'                     => 'string|max:255'
'slug'                      => 'string|unique|max:255'
'excerpt'                   => 'string|max:500|nullable'
'content'                   => 'text'

// Category
'category'                  => 'enum:announcement,update,event,tournament,tips,community,other'
'tags'                      => 'json|nullable' // Array of tags

// Media
'featured_image'            => 'string|nullable'
'images'                    => 'json|nullable'

// SEO
'meta_title'                => 'string|max:255|nullable'
'meta_description'          => 'string|max:500|nullable'

// Status
'status'                    => 'enum:draft,published,archived|default:draft'
'is_featured'               => 'boolean|default:false'
'published_at'              => 'timestamp|nullable'

// Statistics
'view_count'                => 'integer|default:0'
'like_count'                => 'integer|default:0'
'comment_count'             => 'integer|default:0'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
'deleted_at'                => 'timestamp|nullable'
```

---

## **TOURNAMENTS SYSTEM**

### **Tournaments Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'organizer_id'              => 'uuid|foreign:users.id'
'title'                     => 'string|max:255'
'slug'                      => 'string|unique|max:255'
'description'               => 'text'
'short_description'         => 'string|max:500|nullable'

// Tournament Type
'format'                    => 'enum:singles,doubles,mixed_doubles,round_robin,single_elimination,double_elimination'
'category'                  => 'enum:recreational,competitive,professional,junior,senior'
'skill_level'               => 'enum:all,beginner,intermediate,advanced,professional|default:all'

// Date & Time
'registration_start'        => 'datetime'
'registration_end'          => 'datetime'
'tournament_start_date'     => 'date'
'tournament_end_date'       => 'date'
'check_in_time'             => 'time|nullable'
'start_time'                => 'time|nullable'

// Location
'court_id'                  => 'bigint|foreign:courts.id|nullable'
'venue_name'                => 'string|max:255|nullable'
'address'                   => 'string|max:500|nullable'
'city'                      => 'string|max:255'
'state'                     => 'string|max:255|nullable'
'country'                   => 'string|max:255'
'latitude'                  => 'decimal:10,8|nullable'
'longitude'                 => 'decimal:11,8|nullable'

// Participation
'min_participants'          => 'integer|default:4'
'max_participants'          => 'integer'
'current_participants'      => 'integer|default:0'
'team_size'                 => 'integer|default:1' // 1 for singles, 2 for doubles
'age_restriction'           => 'string|max:100|nullable'
'gender_restriction'        => 'enum:all,male,female,mixed|default:all'

// Fees & Prizes
'entry_fee'                 => 'decimal:10,2|default:0.00'
'currency'                  => 'string|max:3|default:PHP'
'prize_pool'                => 'decimal:10,2|nullable'
'prizes'                    => 'json|nullable' // Array of prize objects

// Rules & Scoring
'rules'                     => 'text|nullable'
'scoring_format'            => 'string|max:255|nullable' // e.g., "Best of 3 games to 11"
'match_duration'            => 'integer|nullable' // in minutes

// Points & Ranking
'points_awarded'            => 'json|nullable' // Points for 1st, 2nd, 3rd, etc.
'affects_ranking'           => 'boolean|default:true'

// Media
'banner_image'              => 'string|nullable'
'images'                    => 'json|nullable'

// Status
'status'                    => 'enum:draft,registration_open,registration_closed,in_progress,completed,cancelled|default:draft'
'is_featured'               => 'boolean|default:false'
'is_public'                 => 'boolean|default:true'

// Contact
'contact_name'              => 'string|max:255|nullable'
'contact_email'             => 'string|email|max:255'
'contact_phone'             => 'string|max:20|nullable'

// Additional
'sponsors'                  => 'json|nullable'
'special_notes'             => 'text|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
'deleted_at'                => 'timestamp|nullable'
```

---

### **Tournament Participants Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'tournament_id'             => 'bigint|foreign:tournaments.id'
'user_id'                   => 'uuid|foreign:users.id'

// Team Information
'team_name'                 => 'string|max:255|nullable'
'partner_user_id'           => 'uuid|foreign:users.id|nullable' // For doubles
'seed_number'               => 'integer|nullable'

// Registration
'registration_date'         => 'datetime'
'status'                    => 'enum:pending,confirmed,checked_in,withdrawn,disqualified'
'payment_status'            => 'enum:unpaid,paid,refunded|nullable'
'payment_id'                => 'bigint|foreign:payments.id|nullable'

// Check-in
'checked_in_at'             => 'timestamp|nullable'
'check_in_notes'            => 'text|nullable'

// Emergency Contact
'emergency_contact_name'    => 'string|max:255|nullable'
'emergency_contact_phone'   => 'string|max:20|nullable'

// Performance
'placement'                 => 'integer|nullable' // Final ranking (1st, 2nd, 3rd, etc.)
'matches_played'            => 'integer|default:0'
'matches_won'               => 'integer|default:0'
'matches_lost'              => 'integer|default:0'
'points_earned'             => 'integer|default:0'

// Additional
'waiver_signed'             => 'boolean|default:false'
'waiver_signed_at'          => 'timestamp|nullable'
'special_notes'             => 'text|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **Tournament Matches Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'tournament_id'             => 'bigint|foreign:tournaments.id'
'round_number'              => 'integer' // 1, 2, 3, etc. (finals, semifinals, etc.)
'match_number'              => 'integer' // Match number within the round

// Participants
'participant_1_id'          => 'bigint|foreign:tournament_participants.id'
'participant_2_id'          => 'bigint|foreign:tournament_participants.id'

// Scheduling
'court_id'                  => 'bigint|foreign:courts.id|nullable'
'court_number'              => 'integer|nullable'
'scheduled_date'            => 'date|nullable'
'scheduled_time'            => 'time|nullable'
'actual_start_time'         => 'datetime|nullable'
'actual_end_time'           => 'datetime|nullable'

// Score
'participant_1_score'       => 'json|nullable' // Array of game scores [11, 8, 11]
'participant_2_score'       => 'json|nullable' // Array of game scores [9, 11, 7]
'winner_id'                 => 'bigint|foreign:tournament_participants.id|nullable'

// Status
'status'                    => 'enum:scheduled,in_progress,completed,forfeited,postponed,cancelled'
'forfeit_reason'            => 'text|nullable'

// Officiating
'referee_id'                => 'uuid|foreign:users.id|nullable'
'referee_notes'             => 'text|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

## **COACHING SYSTEM**

### **Coaches Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id|unique'

// Professional Info
'bio'                       => 'text|nullable'
'specialties'               => 'json|nullable' // Array: ['beginners', 'advanced_techniques', 'tournament_prep']
'years_of_experience'       => 'integer|min:0'
'coaching_philosophy'       => 'text|nullable'

// Certifications
'certifications'            => 'json|nullable' // Array of certification objects
'certifications_verified'   => 'boolean|default:false'
'verified_by'               => 'uuid|foreign:users.id|nullable'
'verified_at'               => 'timestamp|nullable'

// Services
'offers_private_lessons'    => 'boolean|default:true'
'offers_group_lessons'      => 'boolean|default:false'
'offers_online_coaching'    => 'boolean|default:false'
'offers_tournament_coaching'=> 'boolean|default:false'

// Pricing
'hourly_rate'               => 'decimal:8,2'
'group_rate'                => 'decimal:8,2|nullable'
'package_deals'             => 'json|nullable' // Array of package objects
'currency'                  => 'string|max:3|default:PHP'

// Availability
'is_accepting_students'     => 'boolean|default:true'
'max_students'              => 'integer|nullable'
'current_students'          => 'integer|default:0'
'availability_schedule'     => 'json|nullable' // Weekly schedule

// Location
'service_areas'             => 'json|nullable' // Array of cities/regions
'willing_to_travel'         => 'boolean|default:false'
'max_travel_distance_km'    => 'integer|nullable'
'travel_fee'                => 'decimal:8,2|nullable'

// Media
'profile_video'             => 'string|nullable'
'action_photos'             => 'json|nullable'

// Statistics
'total_lessons_given'       => 'integer|default:0'
'total_students'            => 'integer|default:0'
'average_rating'            => 'decimal:3,2|default:0.00'
'review_count'              => 'integer|default:0'

// Status
'status'                    => 'enum:pending,active,inactive,suspended|default:pending'
'is_featured'               => 'boolean|default:false'
'featured_until'            => 'timestamp|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **Coaching Sessions Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'coach_id'                  => 'bigint|foreign:coaches.id'
'student_id'                => 'uuid|foreign:users.id'

// Session Type
'session_type'              => 'enum:private,group,online,tournament_prep'
'skill_focus'               => 'json|nullable' // Array: ['serves', 'volleys', 'strategy']

// Scheduling
'session_date'              => 'date'
'start_time'                => 'time'
'end_time'                  => 'time'
'duration_minutes'          => 'integer'

// Location
'location_type'             => 'enum:court,online,other'
'court_id'                  => 'bigint|foreign:courts.id|nullable'
'location_details'          => 'text|nullable'
'meeting_link'              => 'string|url|max:500|nullable'

// Group Sessions
'is_group_session'          => 'boolean|default:false'
'max_participants'          => 'integer|nullable'
'current_participants'      => 'integer|default:1'

// Pricing
'rate'                      => 'decimal:8,2'
'currency'                  => 'string|max:3|default:PHP'
'payment_status'            => 'enum:unpaid,paid,refunded,partially_refunded'
'payment_id'                => 'bigint|foreign:payments.id|nullable'

// Status
'status'                    => 'enum:scheduled,confirmed,in_progress,completed,cancelled,no_show'
'confirmation_code'         => 'string|unique|max:20'

// Cancellation
'cancelled_at'              => 'timestamp|nullable'
'cancelled_by'              => 'uuid|foreign:users.id|nullable'
'cancellation_reason'       => 'text|nullable'
'cancellation_fee'          => 'decimal:8,2|nullable'

// Notes
'student_goals'             => 'text|nullable'
'coach_notes_before'        => 'text|nullable'
'coach_notes_after'         => 'text|nullable'
'homework_assigned'         => 'text|nullable'

// Completion
'completed_at'              => 'timestamp|nullable'
'student_attended'          => 'boolean|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **Coaching Session Participants Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'session_id'                => 'bigint|foreign:coaching_sessions.id'
'user_id'                   => 'uuid|foreign:users.id'
'joined_at'                 => 'timestamp'
'attended'                  => 'boolean|default:false'
'created_at'                => 'timestamp'
```

---

## **RANKINGS & POINTS SYSTEM**

### **Player Rankings Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id|unique'

// Current Rankings
'overall_rank'              => 'integer|nullable'
'singles_rank'              => 'integer|nullable'
'doubles_rank'              => 'integer|nullable'
'mixed_doubles_rank'        => 'integer|nullable'

// Points
'total_points'              => 'integer|default:0'
'singles_points'            => 'integer|default:0'
'doubles_points'            => 'integer|default:0'
'mixed_doubles_points'      => 'integer|default:0'

// Previous Rankings (for trend)
'previous_overall_rank'     => 'integer|nullable'
'previous_singles_rank'     => 'integer|nullable'
'previous_doubles_rank'     => 'integer|nullable'
'rank_change'               => 'integer|default:0' // Positive = up, Negative = down

// Regional Rankings
'regional_rank'             => 'integer|nullable'
'region'                    => 'string|max:255|nullable'
'city_rank'                 => 'integer|nullable'

// Division/Skill Level
'division'                  => 'enum:beginner,intermediate,advanced,professional,elite|default:beginner'
'skill_rating'              => 'decimal:4,2|nullable' // DUPR or similar rating

// Statistics
'tournaments_played'        => 'integer|default:0'
'tournaments_won'           => 'integer|default:0'
'matches_played'            => 'integer|default:0'
'matches_won'               => 'integer|default:0'
'win_rate'                  => 'decimal:5,2|default:0.00'

// Last Updated
'last_tournament_date'      => 'date|nullable'
'last_ranking_update'       => 'timestamp|nullable'

// Status
'is_active'                 => 'boolean|default:true'
'status'                    => 'enum:active,inactive,retired|default:active'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **Points Transactions Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id'

// Transaction Type
'type'                      => 'enum:earned,redeemed,bonus,penalty,expired,adjusted'
'source'                    => 'enum:tournament,contest,referral,purchase,admin,event,achievement'

// Points
'points'                    => 'integer'
'balance_before'            => 'integer'
'balance_after'             => 'integer'

// Reference
'reference_type'            => 'string|nullable' // Polymorphic: Tournament, Contest, etc.
'reference_id'              => 'bigint|nullable' // Polymorphic ID
'description'               => 'string|max:500'

// Expiration
'expires_at'                => 'timestamp|nullable'
'expired'                   => 'boolean|default:false'

// Metadata
'metadata'                  => 'json|nullable'

'created_at'                => 'timestamp'
```

---

### **Rewards Catalog Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'name'                      => 'string|max:255'
'description'               => 'text'
'short_description'         => 'string|max:500|nullable'

// Type
'reward_type'               => 'enum:physical,digital,discount,voucher,premium_feature,merchandise'
'category'                  => 'string|max:100|nullable'

// Points
'points_required'           => 'integer'

// Inventory
'stock_quantity'            => 'integer|nullable' // Null = unlimited
'is_in_stock'               => 'boolean|default:true'
'total_redeemed'            => 'integer|default:0'

// Limits
'limit_per_user'            => 'integer|nullable'
'daily_limit'               => 'integer|nullable'

// Media
'image'                     => 'string|nullable'
'images'                    => 'json|nullable'

// Terms
'terms_and_conditions'      => 'text|nullable'
'redemption_instructions'   => 'text|nullable'

// Availability
'available_from'            => 'datetime|nullable'
'available_until'           => 'datetime|nullable'

// Status
'status'                    => 'enum:active,inactive,out_of_stock,expired|default:active'
'is_featured'               => 'boolean|default:false'
'display_order'             => 'integer|default:0'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **Reward Redemptions Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id'
'reward_id'                 => 'bigint|foreign:rewards_catalog.id'
'points_transaction_id'     => 'bigint|foreign:points_transactions.id'

// Redemption Details
'points_spent'              => 'integer'
'redemption_code'           => 'string|unique|max:50'
'status'                    => 'enum:pending,processing,fulfilled,shipped,delivered,cancelled|default:pending'

// Fulfillment
'fulfilled_at'              => 'timestamp|nullable'
'fulfilled_by'              => 'uuid|foreign:users.id|nullable'

// Shipping (if applicable)
'shipping_address'          => 'json|nullable'
'tracking_number'           => 'string|max:255|nullable'
'shipped_at'                => 'timestamp|nullable'
'delivered_at'              => 'timestamp|nullable'

// Notes
'user_notes'                => 'text|nullable'
'admin_notes'               => 'text|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

## **COMMUNITY FEATURES**

### **Groups Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'creator_id'                => 'uuid|foreign:users.id'
'name'                      => 'string|max:255'
'slug'                      => 'string|unique|max:255'
'description'               => 'text|nullable'
'short_description'         => 'string|max:500|nullable'

// Type & Category
'group_type'                => 'enum:public,private,invite_only|default:public'
'category'                  => 'enum:recreational,competitive,social,training,regional,age_based,skill_based,other'

// Location
'is_location_based'         => 'boolean|default:false'
'city'                      => 'string|max:255|nullable'
'state'                     => 'string|max:255|nullable'
'country'                   => 'string|max:255|nullable'

// Membership
'max_members'               => 'integer|nullable'
'current_member_count'      => 'integer|default:1'
'requires_approval'         => 'boolean|default:false'

// Settings
'allow_member_posts'        => 'boolean|default:true'
'allow_member_invites'      => 'boolean|default:true'
'is_featured'               => 'boolean|default:false'

// Media
'cover_photo'               => 'string|nullable'
'group_photo'               => 'string|nullable'

// Rules
'rules'                     => 'text|nullable'

// Status
'status'                    => 'enum:active,inactive,archived|default:active'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **Group Members Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'group_id'                  => 'bigint|foreign:groups.id'
'user_id'                   => 'uuid|foreign:users.id'

// Membership
'role'                      => 'enum:owner,admin,moderator,member|default:member'
'status'                    => 'enum:pending,active,banned|default:active'

// Dates
'joined_at'                 => 'timestamp'
'approved_at'               => 'timestamp|nullable'
'approved_by'               => 'uuid|foreign:users.id|nullable'

// Settings
'notifications_enabled'     => 'boolean|default:true'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'

// Unique constraint
UNIQUE KEY unique_group_member (group_id, user_id)
```

---

### **Teams Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'captain_id'                => 'uuid|foreign:users.id'
'name'                      => 'string|max:255'
'slug'                      => 'string|unique|max:255'
'tagline'                   => 'string|max:255|nullable'
'description'               => 'text|nullable'

// Team Type
'team_type'                 => 'enum:singles,doubles,mixed,league|default:doubles'
'skill_level'               => 'enum:beginner,intermediate,advanced,professional|nullable'

// Location
'city'                      => 'string|max:255|nullable'
'state'                     => 'string|max:255|nullable'
'country'                   => 'string|max:255'

// Membership
'max_members'               => 'integer|default:10'
'current_member_count'      => 'integer|default:1'
'is_recruiting'             => 'boolean|default:true'

// Media
'logo'                      => 'string|nullable'
'cover_photo'               => 'string|nullable'
'team_photos'               => 'json|nullable'

// Colors
'primary_color'             => 'string|max:7|nullable' // Hex color
'secondary_color'           => 'string|max:7|nullable'

// Statistics
'tournaments_entered'       => 'integer|default:0'
'tournaments_won'           => 'integer|default:0'
'total_matches_played'      => 'integer|default:0'
'total_matches_won'         => 'integer|default:0'
'team_ranking'              => 'integer|nullable'

// Status
'status'                    => 'enum:active,inactive,disbanded|default:active'
'is_verified'               => 'boolean|default:false'
'verified_at'               => 'timestamp|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **Team Members Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'team_id'                   => 'bigint|foreign:teams.id'
'user_id'                   => 'uuid|foreign:users.id'

// Membership
'role'                      => 'enum:captain,co_captain,player,substitute|default:player'
'jersey_number'             => 'integer|nullable'
'position'                  => 'string|max:100|nullable'

// Dates
'joined_at'                 => 'timestamp'
'status'                    => 'enum:active,inactive,removed|default:active'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'

// Unique constraint
UNIQUE KEY unique_team_member (team_id, user_id)
```

---

### **Community Posts Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'author_id'                 => 'uuid|foreign:users.id'

// Post Context
'postable_type'             => 'string|nullable' // Polymorphic: Group, Team, etc.
'postable_id'               => 'bigint|nullable' // Polymorphic ID

// Content
'content'                   => 'text'
'post_type'                 => 'enum:text,image,video,poll,achievement,match_result|default:text'

// Media
'media'                     => 'json|nullable' // Array of media objects

// Poll (if applicable)
'poll_options'              => 'json|nullable'
'poll_ends_at'              => 'timestamp|nullable'
'allow_multiple_votes'      => 'boolean|default:false'

// Engagement
'like_count'                => 'integer|default:0'
'comment_count'             => 'integer|default:0'
'share_count'               => 'integer|default:0'

// Visibility
'visibility'                => 'enum:public,group,team,friends|default:public'
'is_pinned'                 => 'boolean|default:false'

// Moderation
'is_edited'                 => 'boolean|default:false'
'edited_at'                 => 'timestamp|nullable'
'status'                    => 'enum:published,hidden,deleted,flagged|default:published'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
'deleted_at'                => 'timestamp|nullable'
```

---

### **Post Comments Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'post_id'                   => 'bigint|foreign:community_posts.id'
'user_id'                   => 'uuid|foreign:users.id'
'parent_comment_id'         => 'bigint|foreign:post_comments.id|nullable' // For nested comments

// Content
'content'                   => 'text'

// Engagement
'like_count'                => 'integer|default:0'

// Moderation
'is_edited'                 => 'boolean|default:false'
'edited_at'                 => 'timestamp|nullable'
'status'                    => 'enum:published,hidden,deleted|default:published'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
'deleted_at'                => 'timestamp|nullable'
```

---

### **Post Likes Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'likeable_type'             => 'string' // Polymorphic: Post, Comment
'likeable_id'               => 'bigint' // Polymorphic ID
'user_id'                   => 'uuid|foreign:users.id'
'created_at'                => 'timestamp'

// Unique constraint
UNIQUE KEY unique_like (likeable_type, likeable_id, user_id)
```

---

## **REVIEWS & RATINGS**

### **Court Reviews Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'court_id'                  => 'bigint|foreign:courts.id'
'user_id'                   => 'uuid|foreign:users.id'
'booking_id'                => 'bigint|foreign:bookings.id|nullable' // Optional link to booking

// Rating
'overall_rating'            => 'decimal:3,2' // 0.00 to 5.00
'cleanliness_rating'        => 'decimal:3,2|nullable'
'facility_rating'           => 'decimal:3,2|nullable'
'staff_rating'              => 'decimal:3,2|nullable'
'value_rating'              => 'decimal:3,2|nullable'

// Review
'title'                     => 'string|max:255|nullable'
'review'                    => 'text'
'pros'                      => 'text|nullable'
'cons'                      => 'text|nullable'

// Media
'photos'                    => 'json|nullable' // Array of photo paths

// Helpful
'helpful_count'             => 'integer|default:0'
'not_helpful_count'         => 'integer|default:0'

// Visit Info
'visit_date'                => 'date|nullable'
'would_recommend'           => 'boolean|default:true'

// Response
'owner_response'            => 'text|nullable'
'owner_response_date'       => 'timestamp|nullable'

// Moderation
'is_verified_visit'         => 'boolean|default:false' // Based on booking
'status'                    => 'enum:pending,published,hidden,flagged|default:published'
'is_edited'                 => 'boolean|default:false'
'edited_at'                 => 'timestamp|nullable'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'

// Unique constraint to prevent duplicate reviews
UNIQUE KEY unique_court_review (court_id, user_id, booking_id)
```

---

### **Coach Reviews Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'coach_id'                  => 'bigint|foreign:coaches.id'
'user_id'                   => 'uuid|foreign:users.id'
'session_id'                => 'bigint|foreign:coaching_sessions.id|nullable'

// Rating
'overall_rating'            => 'decimal:3,2' // 0.00 to 5.00
'teaching_quality'          => 'decimal:3,2|nullable'
'communication'             => 'decimal:3,2|nullable'
'professionalism'           => 'decimal:3,2|nullable'
'value_for_money'           => 'decimal:3,2|nullable'

// Review
'title'                     => 'string|max:255|nullable'
'review'                    => 'text'
'what_i_learned'            => 'text|nullable'

// Helpful
'helpful_count'             => 'integer|default:0'

// Recommendation
'would_recommend'           => 'boolean|default:true'
'skill_improvement'         => 'enum:significant,moderate,minimal,none|nullable'

// Response
'coach_response'            => 'text|nullable'
'coach_response_date'       => 'timestamp|nullable'

// Moderation
'is_verified_session'       => 'boolean|default:false'
'status'                    => 'enum:pending,published,hidden|default:published'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'

// Unique constraint
UNIQUE KEY unique_coach_review (coach_id, user_id, session_id)
```

---

### **Product Reviews Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'product_id'                => 'bigint|foreign:products.id'
'user_id'                   => 'uuid|foreign:users.id'
'order_id'                  => 'bigint|foreign:orders.id|nullable'

// Rating
'rating'                    => 'decimal:3,2' // 0.00 to 5.00
'quality_rating'            => 'decimal:3,2|nullable'
'value_rating'              => 'decimal:3,2|nullable'

// Review
'title'                     => 'string|max:255|nullable'
'review'                    => 'text'

// Media
'photos'                    => 'json|nullable'
'videos'                    => 'json|nullable'

// Helpful
'helpful_count'             => 'integer|default:0'
'not_helpful_count'         => 'integer|default:0'

// Purchase verification
'is_verified_purchase'      => 'boolean|default:false'
'would_recommend'           => 'boolean|default:true'

// Moderation
'status'                    => 'enum:pending,published,hidden,flagged|default:pending'

'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

## **SEARCH & FILTER ENGINE**

### **Search History Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id|nullable'
'session_id'                => 'string|max:255|nullable' // For guest users

// Search Query
'search_query'              => 'string|max:500'
'search_type'               => 'enum:courts,players,coaches,tournaments,products,events,general'

// Filters Applied
'filters'                   => 'json|nullable' // Object of filters applied

// Results
'results_count'             => 'integer|default:0'
'clicked_result_id'         => 'bigint|nullable'
'clicked_result_type'       => 'string|nullable'

// Location context
'search_latitude'           => 'decimal:10,8|nullable'
'search_longitude'          => 'decimal:11,8|nullable'
'search_location'           => 'string|max:255|nullable'

// Metadata
'ip_address'                => 'string|max:45|nullable'
'user_agent'                => 'text|nullable'

'created_at'                => 'timestamp'
```

---

### **Tags Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'name'                      => 'string|unique|max:100'
'slug'                      => 'string|unique|max:100'
'type'                      => 'enum:court,player,coach,tournament,product,general|default:general'
'description'               => 'text|nullable'
'usage_count'               => 'integer|default:0'
'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

### **Taggables Table Fields (Polymorphic)**

```php
'id'                        => 'bigint|primary|auto_increment'
'tag_id'                    => 'bigint|foreign:tags.id'
'taggable_type'             => 'string' // Polymorphic: Court, Player, Coach, etc.
'taggable_id'               => 'bigint' // Polymorphic ID
'created_at'                => 'timestamp'

// Indexes
INDEX idx_taggable (taggable_type, taggable_id)
INDEX idx_tag (tag_id)
```

---

## **LOCATION & MAP FEATURES**

### **Additional Fields for Courts Table** *(Already in Courts section)*

The courts table already includes necessary location fields:
- `latitude`, `longitude`
- `address`, `city`, `state_province`, `country`, `postal_code`

### **Saved Locations Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id'
'name'                      => 'string|max:255' // e.g., "Home", "Work", "Favorite Court"
'address'                   => 'string|max:500'
'city'                      => 'string|max:255|nullable'
'state'                     => 'string|max:255|nullable'
'country'                   => 'string|max:255'
'postal_code'               => 'string|max:20|nullable'
'latitude'                  => 'decimal:10,8'
'longitude'                 => 'decimal:11,8'
'is_default'                => 'boolean|default:false'
'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
```

---

## **ANALYTICS & LOGGING**

### **Activity Logs Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'user_id'                   => 'uuid|foreign:users.id|nullable'
'log_type'                  => 'enum:user_activity,system,security,api,error'

// Activity Details
'action'                    => 'string|max:100' // view, create, update, delete, etc.
'subject_type'              => 'string|nullable' // Polymorphic: Court, Booking, etc.
'subject_id'                => 'bigint|nullable' // Polymorphic ID
'description'               => 'text|nullable'

// Request Info
'ip_address'                => 'string|max:45|nullable'
'user_agent'                => 'text|nullable'
'url'                       => 'string|max:500|nullable'
'method'                    => 'string|max:10|nullable' // GET, POST, etc.

// Additional Data
'properties'                => 'json|nullable' // Old values, new values, etc.
'metadata'                  => 'json|nullable'

'created_at'                => 'timestamp'
```

---

### **Analytics Data Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'metric_type'               => 'string|max:100' // court_views, bookings, revenue, etc.
'metric_name'               => 'string|max:255'
'metric_value'              => 'decimal:15,2'
'metric_unit'               => 'string|max:50|nullable' // count, currency, percentage, etc.

// Dimensions
'date'                      => 'date'
'hour'                      => 'integer|nullable'
'day_of_week'               => 'string|max:20|nullable'
'month'                     => 'integer|nullable'
'year'                      => 'integer|nullable'

// Segmentation
'user_id'                   => 'uuid|foreign:users.id|nullable'
'court_id'                  => 'bigint|foreign:courts.id|nullable'
'category'                  => 'string|max:100|nullable'

// Additional Data
'metadata'                  => 'json|nullable'

'created_at'                => 'timestamp'
```

---

## **ADMIN DASHBOARD**

### **Admin Audit Logs Table Fields**

```php
'id'                        => 'bigint|primary|auto_increment'
'admin_id'                  => 'uuid|foreign:users.id'
'action'                    => 'string|max:100'
'target_type'               => 'string|nullable' // Polymorphic
'target_id'                 => 'bigint|nullable' // Polymorphic

// Action Details
'description'               => 'text'
'changes'                   => 'json|nullable' // Before/after values
'severity'                  => 'enum:low,medium,high,critical|default:low'

// Request Info
'ip_address'                => 'string|max:45'
'user_agent'                => 'text|nullable'

'created_at'                => 'timestamp'
```

---

## **FIELD NAMING CONVENTIONS**

### **General Rules**
1. Use `snake_case` for all field names
2. Use descriptive names that clearly indicate purpose
3. Suffix boolean fields with verbs: `is_`, `has_`, `can_`, `should_`
4. Suffix timestamp fields with `_at`: `created_at`, `verified_at`
5. Suffix count fields with `_count`: `view_count`, `login_count`
6. Use `_id` suffix for foreign keys

### **Common Field Types**
```php
// Timestamps
'created_at'                => 'timestamp'
'updated_at'                => 'timestamp'
'deleted_at'                => 'timestamp|nullable' // Soft deletes

// Boolean flags
'is_active'                 => 'boolean|default:true'
'is_featured'               => 'boolean|default:false'
'has_variants'              => 'boolean|default:false'

// Status fields
'status'                    => 'enum:...'
'payment_status'            => 'enum:...'

// Monetary values
'price'                     => 'decimal:10,2'
'amount'                    => 'decimal:10,2'
'currency'                  => 'string|max:3|default:USD'

// Ratings
'rating'                    => 'decimal:3,2|default:0.00' // 0.00 to 5.00
'average_rating'            => 'decimal:3,2|default:0.00'

// Counts
'view_count'                => 'integer|default:0'
'review_count'              => 'integer|default:0'

// JSON fields
'metadata'                  => 'json|nullable'
'properties'                => 'json|nullable'
'settings'                  => 'json|nullable'
```

---

## **VALIDATION RULES REFERENCE**

### **Common Validation Patterns**

```php
// Email
'email' => 'required|email:rfc,dns|max:255|unique:users,email'

// Password
'password' => 'required|string|min:8|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/'

// Phone
'phone_number' => 'nullable|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:20'

// URL
'website' => 'nullable|url|max:255'

// Date
'date_of_birth' => 'required|date|before:-18 years'

// Coordinates
'latitude' => 'nullable|numeric|between:-90,90'
'longitude' => 'nullable|numeric|between:-180,180'

// Price
'price' => 'required|numeric|min:0|max:999999.99'

// Image
'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120' // 5MB

// Enum
'status' => 'required|in:pending,approved,rejected'

// JSON
'amenities' => 'nullable|array'
'amenities.*' => 'string|max:100'
```

---

## **RELATIONSHIP PATTERNS**

### **One-to-One**
```php
// User has one Profile
User::hasOne(UserProfile::class)
UserProfile::belongsTo(User::class)
```

### **One-to-Many**
```php
// User has many Bookings
User::hasMany(Booking::class)
Booking::belongsTo(User::class)
```

### **Many-to-Many**
```php
// User has many Events through Registrations
User::belongsToMany(Event::class, 'event_registrations')
Event::belongsToMany(User::class, 'event_registrations')
```

### **Polymorphic**
```php
// Payment can belong to Order or Booking
Payment::morphTo('payable')
Order::morphMany(Payment::class, 'payable')
Booking::morphMany(Payment::class, 'payable')
```

---

## **INDEX RECOMMENDATIONS**

### **Always Index**
- Primary keys (automatic)
- Foreign keys
- Unique fields (email, slug, etc.)
- Status fields used in WHERE clauses
- Date fields used for filtering/sorting
- Fields used in JOIN operations

### **Consider Indexing**
- Search fields (name, title, description)
- Frequently filtered fields
- Sorting fields
- Composite indexes for common query patterns

### **Example Indexes**
```php
// Single column
$table->index('status');
$table->index('created_at');

// Composite
$table->index(['court_id', 'booking_date']);
$table->index(['user_id', 'status']);

// Full-text search
$table->fullText(['name', 'description']);
```

---

## **BEST PRACTICES**

1. **Always include timestamps** (`created_at`, `updated_at`)
2. **Use soft deletes** for important data (`deleted_at`)
3. **Store monetary values** as decimals, never floats
4. **Use enums** for predefined status values
5. **Store JSON** for flexible, non-queryable data
6. **Add indexes** for frequently queried fields
7. **Use foreign keys** with proper cascade rules
8. **Validate all inputs** at the request level
9. **Use migrations** for all schema changes
10. **Document field purposes** in migration comments

---

**Last Updated:** January 29, 2026
**Version:** 1.0.0
