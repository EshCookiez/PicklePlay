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
9. [Admin Dashboard](#admin-dashboard)
10. [Integrations](#integrations)
11. [Data Management & Export](#data-management--export)
12. [Analytics & Logging](#analytics--logging)
13. [Player Profile System](#player-profile-system)

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
