# PicklePlay - User Roles & Role-Based Access Control (RBAC)

## 📋 Overview

PicklePlay implements a comprehensive Role-Based Access Control (RBAC) system to manage different user types and their permissions across the platform. This document outlines the five distinct user roles, their responsibilities, permissions, and system interactions.

---

## 👥 User Roles Overview

### 1. **Super Admin** 🔐
**The Highest Level Authority**

#### Purpose:
- Complete system oversight and management
- Platform maintenance and configuration
- User management (all roles)
- Content moderation and policy enforcement
- System analytics and reporting

#### Key Permissions:
- ✅ Create, read, update, delete all users and roles
- ✅ Manage admin and court owner accounts
- ✅ Access complete audit logs and analytics
- ✅ Configure platform settings and policies
- ✅ Manage all courts across the platform
- ✅ Override any permission restrictions
- ✅ View system-wide statistics and metrics
- ✅ Manage abuse reports and violations
- ✅ Create and manage other super admins
- ✅ Access financial reports and transactions

#### Responsibilities:
- Ensure platform stability and performance
- Enforce community guidelines
- Monitor system health and security
- Generate system-wide reports
- Handle escalated issues from other roles

#### Dashboard Access:
- System Control Panel
- All user management tools
- Audit logs and activity monitoring
- Financial analytics
- System settings configuration

---

### 2. **Admin** 👨‍💼
**Platform Manager & Content Moderator**

#### Purpose:
- Manage court listings and information
- Moderate user content and conduct
- Monitor coaching activities
- Support customer inquiries
- Maintain data quality across platform

#### Key Permissions:
- ✅ Create, read, update, delete court listings
- ✅ Manage court amenities and details
- ✅ Moderate user reviews and comments
- ✅ Remove inappropriate content
- ✅ Manage coaching program listings
- ✅ View user activity and reports
- ✅ Process refunds and billing issues
- ✅ Create system announcements
- ✅ Access moderation dashboard
- ❌ Cannot modify user passwords
- ❌ Cannot access financial transactions
- ❌ Cannot create new admins

#### Responsibilities:
- Keep court information current and accurate
- Monitor and moderate community content
- Review and respond to user reports
- Support fair play and community standards
- Handle customer service escalations

#### Dashboard Access:
- Admin Management Panel
- Court management tools
- Moderation queue
- User reports and complaints
- Customer support dashboard

---

### 3. **Coach** 🏆
**Training & Lesson Provider**

#### Purpose:
- Offer professional coaching services
- Manage lessons and availability
- Build professional profile
- Track student progress
- Generate income through lesson bookings

#### Key Permissions:
- ✅ Create and manage own coach profile
- ✅ Set availability and pricing
- ✅ View booked lessons
- ✅ Receive booking notifications
- ✅ Upload credentials and certifications
- ✅ Manage own reviews and ratings
- ✅ Track earnings and bookings
- ✅ Communicate with students via messaging
- ✅ Create coaching packages
- ✅ View student roster for booked lessons
- ❌ Cannot create other coach profiles
- ❌ Cannot modify other coaches' information
- ❌ Cannot access admin functions
- ❌ Cannot manage courts

#### Responsibilities:
- Maintain professional standards
- Provide quality coaching services
- Keep availability calendar updated
- Respond to booking requests
- Deliver excellent customer service
- Build positive reputation

#### Dashboard Access:
- Coach Profile Dashboard
- Lesson management panel
- Booking calendar
- Earnings and statistics
- Student communication tools

---

### 4. **Customer** 👤
**Platform User & Participant**

#### Purpose:
- Browse and discover courts
- Book coaching lessons
- Connect with other players
- Participate in tournaments
- Track personal ranking and statistics

#### Key Permissions:
- ✅ View public court information
- ✅ Search and filter courts
- ✅ View coach profiles and availability
- ✅ Book coaching lessons
- ✅ Create and manage personal profile
- ✅ Leave reviews and ratings
- ✅ Participate in tournaments
- ✅ Connect with other players
- ✅ View personal statistics
- ✅ Manage booking history
- ✅ Message coaches and players
- ❌ Cannot modify court information
- ❌ Cannot access admin functions
- ❌ Cannot view other users' private information
- ❌ Cannot delete reviews

#### Responsibilities:
- Maintain respectful community conduct
- Provide honest reviews and feedback
- Follow community guidelines
- Update personal information accurately
- Respect other players' privacy

#### Dashboard Access:
- User Dashboard
- Personal profile management
- Court discovery and details
- Booking history
- Personal statistics
- Message inbox

---

### 5. **Court Owner** 🏢
**Facility Manager & Business Owner**

#### Purpose:
- Manage court facility information
- Control court availability and scheduling
- Monitor court reputation and reviews
- Manage facility staff (future feature)
- Generate revenue from court bookings

#### Key Permissions:
- ✅ Create and manage own court listing(s)
- ✅ Update court details and amenities
- ✅ Set availability and pricing
- ✅ View booking calendar and reservations
- ✅ Manage court images and media
- ✅ Respond to reviews and ratings
- ✅ View facility statistics and analytics
- ✅ Export booking reports
- ✅ Manage court operating hours
- ✅ Track facility revenue
- ❌ Cannot modify other courts
- ❌ Cannot access customer information
- ❌ Cannot delete customer reviews
- ❌ Cannot access admin functions
- ❌ Cannot modify pricing for other courts

#### Responsibilities:
- Keep court information accurate and updated
- Maintain facility standards
- Respond professionally to customer feedback
- Provide accurate availability information
- Ensure compliance with booking agreements

#### Dashboard Access:
- Court Owner Dashboard
- Facility management tools
- Booking calendar and management
- Analytics and reporting
- Review management
- Revenue tracking

---

## 📊 Permission Matrix

| Feature | Super Admin | Admin | Coach | Customer | Court Owner |
|---------|:-----------:|:-----:|:-----:|:--------:|:-----------:|
| **User Management** |
| Create Users | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit Any User | ✅ | ❌ | ❌ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Court Management** |
| Create Courts | ✅ | ✅ | ❌ | ❌ | ✅ |
| Edit Courts | ✅ | ✅ | ❌ | ❌ | ✅* |
| Delete Courts | ✅ | ✅ | ❌ | ❌ | ✅* |
| **Coaching** |
| Create Coach Profile | ✅ | ❌ | ✅ | ❌ | ❌ |
| Manage Coach Schedule | ✅ | ❌ | ✅ | ❌ | ❌ |
| Book Lessons | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Reviews & Ratings** |
| View All Reviews | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete Reviews | ✅ | ✅ | ❌ | ❌* | ❌ |
| Respond to Reviews | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Content Moderation** |
| Moderate Content | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ban Users | ✅ | ✅ | ❌ | ❌ | ❌ |
| Remove Listings | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Analytics & Reports** |
| View System Analytics | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Own Analytics | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Settings & Configuration** |
| System Settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Admins | ✅ | ❌ | ❌ | ❌ | ❌ |

*Can only perform on own resources (marked with *)

---

## 🔄 User Journey by Role

### Super Admin Journey
```
Login → Admin Panel → User Management 
     → Court Management → Moderation 
     → Analytics → Settings
```

### Admin Journey
```
Login → Admin Panel → Court Management 
     → Content Moderation → Support Requests 
     → Analytics
```

### Coach Journey
```
Login → Coach Dashboard → Manage Profile 
     → Set Availability → View Bookings 
     → Manage Lessons → Track Earnings
```

### Customer Journey
```
Login → User Dashboard → Search Courts 
     → Browse Coaches → Book Lessons 
     → Join Tournaments → View Profile
```

### Court Owner Journey
```
Login → Court Owner Dashboard → Manage Courts 
     → Set Pricing → View Bookings 
     → Respond to Reviews → Analytics
```

---

## 🔐 Authentication & Authorization Flow

### Role Assignment
1. **User Registration**: New user defaults to **Customer** role
2. **Court Owner Signup**: Can register directly as **Court Owner**
3. **Coach Application**: Customer can request **Coach** role (with verification)
4. **Admin Promotion**: Only **Super Admin** can promote users to **Admin**
5. **Super Admin**: Created during initial system setup

### Permission Checking Flow
```
Request → Authentication Middleware
     ↓
Verify User Token
     ↓
Middleware → Get User Role
     ↓
Check Permission Level
     ↓
Yes → Allow Request → Execute Action
No → Return 403 Forbidden
```

---

## 🛡️ Security Considerations

### Role-Based Restrictions
- Each role has specific middleware constraints
- API endpoints validate user role before execution
- Cross-role access attempts are logged
- Unauthorized access attempts trigger alerts

### Best Practices
1. **Least Privilege**: Users get minimum required permissions
2. **Role Separation**: Incompatible roles cannot coexist
3. **Audit Trails**: All role changes are logged
4. **Token Management**: Tokens include role information
5. **Rate Limiting**: Applied based on user role

---

## 📱 Frontend Conditional Rendering

The frontend conditionally displays UI elements based on user role:

```typescript
// Example: Show admin controls only to admins
{user.role === 'admin' && <AdminDashboard />}

// Example: Show coach tools only to coaches
{user.role === 'coach' && <CoachDashboard />}

// Example: Show court management only to court owners
{user.role === 'court_owner' && <CourtManagement />}
```

---

## 🔄 Role Transitions

### Possible Role Changes
- **Customer → Coach**: Application + Verification
- **Customer/Coach → Court Owner**: Can hold multiple roles
- **User → Admin**: Only by Super Admin decision
- **Anyone → Super Admin**: Not possible after initial setup

### Restrictions
- Cannot have conflicting roles simultaneously
- Role changes require user confirmation
- Historical role data is maintained for audit purposes

---

## 📊 Implementation Checklist

- [ ] Database schema with role field
- [ ] Migration for adding roles to users table
- [ ] Middleware for role-based authentication
- [ ] Gate/Policy definitions for permissions
- [ ] API endpoint protection by role
- [ ] Frontend role-based component display
- [ ] User role management endpoints
- [ ] Audit logging for role changes
- [ ] Role seed data for initial setup
- [ ] Testing for RBAC scenarios

---

## 🚀 Future Enhancements

1. **Dynamic Permissions**: Create custom permission sets
2. **Role Inheritance**: Hierarchical role structure
3. **Temporary Roles**: Time-limited role assignments
4. **Permission Groups**: Bundled permissions
5. **Delegation**: Allow admins to delegate specific permissions
6. **Social Roles**: Community moderator, tournament organizer
7. **Subscription-based Roles**: Premium coach tier
8. **Regional Roles**: Court managers by geographic region

---

## 📞 Support & Questions

For questions about user roles and permissions:
- Contact: support@pickleplay.com
- Documentation: [PicklePlay Docs](https://docs.pickleplay.com)
- Community: [PicklePlay Forum](https://forum.pickleplay.com)
