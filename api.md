# Event Management System - API Documentation

## Architecture Overview

The Event Management System uses a microservices architecture with an API Gateway (YARP - Yet Another Reverse Proxy) that routes requests to various backend services running on different ports.

---

## API Gateway Configuration (YARP)

**Gateway URL:** `http://localhost:5000`

### Gateway Routing Configuration

The API Gateway routes incoming requests to the following services:

| Route Pattern | Cluster | Backend Service Address | Port |
|---|---|---|---|
| `/api/auth/*` | auth-cluster | http://localhost:6003 | 6003 |
| `/api/roles/*` | auth-cluster | http://localhost:6003 | 6003 |
| `/api/users/*` | auth-cluster | http://localhost:6003 | 6003 |
| `/api/events/*` | event-cluster | http://localhost:6101 | 6101 |
| `/api/categories/*` | event-cluster | http://localhost:6101 | 6101 |
| `/api/organizers/*` | event-cluster | http://localhost:6101 | 6101 |
| `/api/eventreviews/*` | event-cluster | http://localhost:6101 | 6101 |
| `/api/favorites/*` | event-cluster | http://localhost:6101 | 6101 |
| `/api/interactions/*` | event-cluster | http://localhost:6101 | 6101 |
| `/api/tickets/*` | ticket-cluster | http://localhost:6201 | 6201 |
| `/api/tickettypes/*` | ticket-cluster | http://localhost:6201 | 6201 |
| `/hubs/ticket/*` | ticket-cluster | http://localhost:6201 | 6201 |
| `/api/bookings/*` | booking-cluster | http://localhost:6301 | 6301 |
| `/api/paymentmethods/*` | payment-cluster | http://localhost:6401 | 6401 |
| `/api/notifications/*` | operation-cluster | http://localhost:6501 | 6501 |
| `/api/checkins/*` | operation-cluster | http://localhost:6501 | 6501 |

### Swagger/OpenAPI Endpoints

The gateway aggregates Swagger documentation from all services:

- **Auth Service:** `http://localhost:5000/auth-service/swagger/v1/swagger.json`
- **Event Service:** `http://localhost:5000/event-service/swagger/v1/swagger.json`
- **Ticket Service:** `http://localhost:5000/ticket-service/swagger/v1/swagger.json`
- **Booking Service:** `http://localhost:5000/booking-service/swagger/v1/swagger.json`
- **Payment Service:** `http://localhost:5000/payment-service/swagger/v1/swagger.json`
- **Operation Service:** `http://localhost:5000/operation-service/swagger/v1/swagger.json`
- **Resale Service:** `http://localhost:5000/resale-service/swagger/v1/swagger.json`

### CORS Configuration

- **Allowed Frontend URL:** `http://localhost:3000`
- **Methods:** All HTTP methods (GET, POST, PUT, DELETE, PATCH)
- **Headers:** All headers allowed
- **Credentials:** Enabled (required for SignalR)

### Authentication

All endpoints use **JWT Bearer Token** authentication where required. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## AUTH SERVICE (Port 6003)

### Controllers and Endpoints

#### 1. Authentication Controller (`/api/auth`)

**Purpose:** Handle user authentication operations including login, registration, password management, and email verification.

##### Endpoints:

| HTTP Method | Endpoint | Request | Response | Status Code | Notes |
|---|---|---|---|---|---|
| **POST** | `/api/auth/login` | `LoginCommand` | `LoginResponse` | 200/400 | Email + Password authentication |
| **POST** | `/api/auth/login-google` | `LoginGoogleCommand` | `LoginGoogleResponse` | 200/400 | OAuth2 Google login |
| **POST** | `/api/auth/refresh` | `RefreshCommand` | `RefreshResponse` | 200/400 | Refresh JWT token |
| **POST** | `/api/auth/logout` | `LogoutCommand` | `LogoutResponse` | 200/400 | Logout user |
| **POST** | `/api/auth/register` | `RegisterCommand` | `RegisterResponse` | 200/400 | Register new user |
| **POST** | `/api/auth/verify-register` | `VerifyRegisterCommand` | `VerifyRegisterResponse` | 201/400 | Verify registration via OTP/Email |
| **POST** | `/api/auth/forgot-password` | `ForgotPasswordCommand` | `ForgotPasswordResponse` | 200/400 | Request password reset |
| **POST** | `/api/auth/verify-forgot-password` | `VerifyForgotPasswordCommand` | `VerifyForgotPasswordResponse` | 200/400 | Verify and reset password |
| **POST** | `/api/auth/change-email` | `ChangeEmailCommand` | `ChangeEmailResponse` | 200/400 | Request email change |
| **POST** | `/api/auth/verify-change-email` | `VerifyChangeEmailCommand` | `VerifyChangeEmailResponse` | 200/400 | Verify new email |
| **POST** | `/api/auth/change-password` | `ChangePasswordCommand` | `ChangePasswordResponse` | 200/400 | Change user password |

##### Request/Response Models:

**POST /api/auth/login - LoginCommand:**

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "location": {
    "latitude": 10.8231,
    "longitude": 106.6883
  }
}
```
Note: `location` is required (LocationRequest). Password: min 8 chars, 1 upper, 1 lower, 1 digit, 1 special char.

**LoginResponse:**
```json
{
  "isSuccess": true,
  "message": "Login successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "listErrors": []
}
```

---

**POST /api/auth/register - RegisterCommand:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "0912345678",
  "password": "Password123!",
  "avatarUrl": "https://example.com/avatar.jpg",
  "gender": 1,
  "dateOfBirth": "1990-01-01T00:00:00Z",
  "address": "123 Main Street"
}
```
Note: Password: min 8 chars, 1 upper, 1 lower, 1 digit, 1 special. Phone: Vietnam format (0[3|5|7|8|9]xxxxxxxx). OTP sent to email.

**RegisterResponse:**
```json
{
  "isSuccess": true,
  "message": "Send register email successfully",
  "data": null,
  "listErrors": []
}
```
Note: User receives OTP via email. Must call `POST /api/auth/verify-register` with email + OTP to complete registration.

---

**POST /api/auth/login-google - LoginGoogleCommand:**

```json
{
  "googleToken": "ya29.a0AfH6SMBx...",
  "location": {
    "latitude": 10.8231,
    "longitude": 106.6883
  }
}
```
Note: `location` is optional. Creates user on first login if not exists.

**LoginGoogleResponse:**
```json
{
  "isSuccess": true,
  "message": "Google login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "listErrors": []
}
```

---

**POST /api/auth/refresh - RefreshCommand:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
Note: `id` is UserId (GUID string). Uses current accessToken + refreshToken to get new tokens.

**RefreshResponse:**
```json
{
  "isSuccess": true,
  "message": "Refresh successfully!",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "listErrors": []
}
```

---

**POST /api/auth/logout - LogoutCommand:**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**LogoutResponse:**
```json
{
  "isSuccess": true,
  "message": "Logout successful",
  "data": null,
  "listErrors": []
}
```

---

**POST /api/auth/verify-register - VerifyRegisterCommand:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```
Note: `otp` must be 6 digits. Returns 201 on success.

**VerifyRegisterResponse:**
```json
{
  "isSuccess": true,
  "message": "Register successfully",
  "data": {
    "email": "john@example.com",
    "otp": "123456"
  },
  "listErrors": []
}
```
Note: Returns VerifyOtpDTO. OTP must be 6 digits. User is created in DB after successful verification.

---

**POST /api/auth/forgot-password - ForgotPasswordCommand:**

```json
{
  "email": "john@example.com"
}
```

**ForgotPasswordResponse:**
```json
{
  "isSuccess": true,
  "message": "Password reset email sent successfully",
  "data": null,
  "listErrors": []
}
```

---

**POST /api/auth/verify-forgot-password - VerifyForgotPasswordCommand:**

```json
{
  "key": "reset_key_from_forgot_password_email",
  "newPassword": "NewPassword123!"
}
```
Note: `key` from forgot-password email. `newPassword` same rules as register password.

**VerifyForgotPasswordResponse:**
```json
{
  "isSuccess": true,
  "message": "Password reset successfully",
  "data": null,
  "listErrors": []
}
```

---

**POST /api/auth/change-email - ChangeEmailCommand:**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "newEmail": "newemail@example.com"
}
```

**ChangeEmailResponse:**
```json
{
  "isSuccess": true,
  "message": "Change email request sent. Please verify your new email.",
  "data": null,
  "listErrors": []
}
```

---

**POST /api/auth/verify-change-email - VerifyChangeEmailCommand:**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "otp": "123456"
}
```

**VerifyChangeEmailResponse:**
```json
{
  "isSuccess": true,
  "message": "Email change verified successfully",
  "data": null,
  "listErrors": []
}
```

---

**POST /api/auth/change-password - ChangePasswordCommand:**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "password": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```
Note: `newPassword` same validation as register. Requires valid current password.

**ChangePasswordResponse:**
```json
{
  "isSuccess": true,
  "message": "Password changed successfully",
  "data": null,
  "listErrors": []
}
```


---

#### 2. User Controller (`/api/users`)

**Purpose:** Manage user profiles and information.

##### Endpoints:

| HTTP Method | Endpoint | Request | Response | Status Code | Notes |
|---|---|---|---|---|---|
| **POST** | `/api/users` | `UserCreateCommand` | `UserCreateResponse` | 201/400 | Create new user |
| **GET** | `/api/users/{id}` | `UserGetByIdQuery` | `UserGetByIdResponse` | 200/400 | Get user by ID |
| **GET** | `/api/users` | `UserGetListQuery` | `UserGetListResponse` | 200/400 | Get paginated list of users |
| **PUT** | `/api/users/{id}` | `UserUpdateCommand` | `UserUpdateResponse` | 201/400 | Update user information |
| **DELETE** | `/api/users/{id}` | - | `UserDeleteResponse` | 200/400 | Hard delete user |
| **PATCH** | `/api/users/{id}` | - | `UserRestoreResponse` | 200/400 | Restore soft-deleted user |

##### User Status Enum:
- `1` = Active
- `2` = Inactive

##### RoleName Enum (for roleName):
- `1` = Admin
- `2` = User
- `3` = Manager
- `4` = Guest

##### Request/Response Models:

**POST /api/users - UserCreateCommand:**

```json
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "0987654321",
  "password": "password123",
  "avatarUrl": "https://example.com/avatar.jpg",
  "gender": 0,
  "dateOfBirth": "1995-05-15T00:00:00Z",
  "address": "456 Oak Avenue",
  "status": 1,
  "roleName": 2,
  "organizerId": null
}
```
Note: `status` is StatusEnum (1=Active, 2=Inactive). `roleName` is RoleNameEnum (1=Admin, 2=User, 3=Manager, 4=Guest). `organizerId` is GUID string or null.

**UserCreateResponse:**
```json
{
  "isSuccess": true,
  "message": "User created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phone": "0987654321",
    "isVerified": false,
    "avatarUrl": "https://example.com/avatar.jpg",
    "gender": 0,
    "dateOfBirth": "1995-05-15T00:00:00Z",
    "address": "456 Oak Avenue",
    "status": 1,
    "role": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "User"
    },
    "organizerId": null,
    "locations": []
  },
  "listErrors": []
}
```

---

**GET /api/users/{id} - UserGetByIdQuery:**

Query Parameters:
```json
{
  "fields": "id,fullName,email,phone",
  "hasLocation": false
}
```

**UserGetByIdResponse:**
```json
{
  "isSuccess": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phone": "0987654321",
    "isVerified": true,
    "avatarUrl": "https://example.com/avatar.jpg",
    "gender": 0,
    "dateOfBirth": "1995-05-15T00:00:00Z",
    "address": "456 Oak Avenue",
    "status": 1,
    "role": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "User"
    },
    "organizerId": null,
    "locations": []
  },
  "listErrors": []
}
```

---

**GET /api/users - UserGetListQuery:**

Query Parameters:
```json
{
  "pageNumber": 1,
  "pageSize": 10,
  "fullName": null,
  "email": null,
  "phone": null,
  "isVerified": null,
  "gender": null,
  "status": null,
  "fields": "id,fullName,email",
  "hasLocation": false,
  "isDescending": false,
  "isDeleted": false
}
```

**UserGetListResponse:**
```json
{
  "isSuccess": true,
  "message": "Users retrieved successfully",
  "data": {
    "totalItems": 150,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 15,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "fullName": "Jane Smith",
        "email": "jane@example.com",
        "phone": "0987654321",
        "isVerified": true,
        "status": 1,
        "role": {
          "id": "550e8400-e29b-41d4-a716-446655440003",
          "name": "User"
        }
      }
    ]
  },
  "listErrors": []
}
```

---

**PUT /api/users/{id} - UserUpdateCommand:**

```json
{
  "fullName": "Jane Smith Updated",
  "phone": "0987654322",
  "avatarUrl": "https://example.com/avatar-new.jpg",
  "gender": 0,
  "dateOfBirth": "1995-05-15T00:00:00Z",
  "address": "789 Pine Road",
  "status": 1,
  "roleName": 2,
  "organizerId": null
}
```

**UserUpdateResponse:**
```json
{
  "isSuccess": true,
  "message": "User updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "fullName": "Jane Smith Updated",
    "email": "jane@example.com",
    "phone": "0987654322",
    "isVerified": true,
    "status": 1,
    "role": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "User"
    }
  },
  "listErrors": []
}
```

---

**DELETE /api/users/{id}:**

**UserDeleteResponse:**
```json
{
  "isSuccess": true,
  "message": "User deleted successfully",
  "data": null,
  "listErrors": []
}
```

---

**PATCH /api/users/{id}:**

**UserRestoreResponse:**
```json
{
  "isSuccess": true,
  "message": "User restored successfully",
  "data": null,
  "listErrors": []
}
```

---

#### 3. Role Controller (`/api/roles`)

**Purpose:** Manage user roles and permissions (requires authorization).

##### Endpoints:

| HTTP Method | Endpoint | Request | Response | Status Code | Authorization | Notes |
|---|---|---|---|---|---|---|
| **GET** | `/api/roles` | `RoleGetAllQuery` | `RoleGetAllResponse` | 200/400 | Required | Get all roles |
| **POST** | `/api/roles` | `RoleCreateCommand` | `RoleCreateResponse` | 201/400 | - | Create new role |
| **POST** | `/api/roles/dumb` | `RoleDumbCommand` | `RoleResponse` | 200/400 | - | Initialize default roles |
| **DELETE** | `/api/roles/{id}` | - | `RoleDeleteResponse` | 200/400 | - | Hard delete role |
| **PATCH** | `/api/roles/{id}` | - | `RoleRestoreResponse` | 200/400 | - | Restore soft-deleted role |

##### Request/Response Models:

**GET /api/roles - RoleGetAllQuery:**

No parameters required

**RoleGetAllResponse:**
```json
{
  "isSuccess": true,
  "message": "Roles retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "User",
      "status": 1,
      "createdAt": "2024-02-16T10:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "name": "Admin",
      "status": 1,
      "createdAt": "2024-02-16T10:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "name": "Organizer",
      "status": 1,
      "createdAt": "2024-02-16T10:00:00Z"
    }
  ],
  "listErrors": []
}
```

---

**POST /api/roles - RoleCreateCommand:**

```json
{
  "name": 3
}
```
Note: `name` is RoleNameEnum (1=Admin, 2=User, 3=Manager, 4=Guest)

**RoleCreateResponse:**
```json
{
  "isSuccess": true,
  "message": "Create role successfully",
  "data": null,
  "listErrors": []
}
```

---

**POST /api/roles/dumb - RoleDumbCommand:**

```json
{}
```

**RoleResponse:**
```json
{
  "isSuccess": true,
  "message": "Default roles initialized",
  "data": null,
  "listErrors": []
}
```

---

**DELETE /api/roles/{id}:**

**RoleDeleteResponse:**
```json
{
  "isSuccess": true,
  "message": "Role deleted successfully",
  "data": null,
  "listErrors": []
}
```

---

**PATCH /api/roles/{id}:**

**RoleRestoreResponse:**
```json
{
  "isSuccess": true,
  "message": "Role restored successfully",
  "data": null,
  "listErrors": []
}
```

---

## EVENT SERVICE (Port 6101)

### Controllers and Endpoints

#### 1. Event Controller (`/api/events`)

**Purpose:** Manage event creation, updates, and retrieval.

##### Endpoints:

| HTTP Method | Endpoint | Request | Response | Status Code | Notes |
|---|---|---|---|---|---|
| **GET** | `/api/events` | `EventGetListQuery` | `EventGetListResponse` | 200/400 | Get paginated list of events |
| **GET** | `/api/events/{id}` | `EventGetByIdQuery` | `EventGetByIdResponse` | 200/400 | Get event details by ID |
| **POST** | `/api/events` | `EventCreateCommand` | `EventCreateResponse` | 201/400 | Create new event |
| **PUT** | `/api/events/{id}` | `EventUpdateCommand` | `EventUpdateResponse` | 200/400 | Update event information |
| **DELETE** | `/api/events/{id}` | - | `EventDeleteResponse` | 200/400 | Hard delete event |
| **PATCH** | `/api/events/{id}` | - | `EventRestoreResponse` | 200/400 | Restore soft-deleted event |

##### Event Status Enum:
- `1` = Draft
- `2` = Published
- `3` = Cancelled
- `4` = Opened
- `5` = Closed

##### Event Location Request (in EventCreateCommand):
Each location object requires: `address`, `province`, `district`, `ward`, `zipcode`, `contactEmail`, `contactPhone`. Optional: `latitude`, `longitude`. Note: Location `name` is auto-set from event name.

##### Request/Response Models:

**POST /api/events - EventCreateCommand:**

```json
{
  "name": "Tech Conference 2024",
  "slug": "tech-conference-2024",
  "subtitle": "Future of Technology",
  "description": "Join us for an exciting tech conference showcasing innovations in AI and cloud computing",
  "tags": [
    { "tagName": "Technology" },
    { "tagName": "Conference" },
    { "tagName": "AI" }
  ],
  "startTime": "2024-06-01T09:00:00Z",
  "endTime": "2024-06-01T17:00:00Z",
  "openTime": "09:00",
  "closedTime": "17:00",
  "thumbnailUrl": "https://example.com/thumb.jpg",
  "bannerUrl": "https://example.com/banner.jpg",
  "ageRestriction": 18,
  "categoryId": "550e8400-e29b-41d4-a716-446655440007",
  "organizerId": "550e8400-e29b-41d4-a716-446655440008",
  "locations": [
    {
      "address": "123 Tech Street",
      "province": "Ho Chi Minh City",
      "district": "District 1",
      "ward": "Ward 1",
      "zipcode": "700000",
      "latitude": 10.8231,
      "longitude": 106.6883,
      "contactEmail": "contact@event.com",
      "contactPhone": "0912345678"
    }
  ]
}
```

**EventCreateResponse:**
```json
{
  "isSuccess": true,
  "message": "Create Event Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440009",
    "name": "Tech Conference 2024",
    "slug": "tech-conference-2024",
    "subtitle": "Future of Technology",
    "description": "Join us for an exciting tech conference...",
    "tags": [
      { "tagName": "Technology" },
      { "tagName": "Conference" }
    ],
    "startTime": "2024-06-01T09:00:00Z",
    "endTime": "2024-06-01T17:00:00Z",
    "openTime": "09:00",
    "closedTime": "17:00",
    "status": 1,
    "thumbnailUrl": "https://example.com/thumb.jpg",
    "bannerUrl": "https://example.com/banner.jpg",
    "ageRestriction": 18,
    "category": {
      "id": "550e8400-e29b-41d4-a716-446655440007",
      "name": "Technology",
      "iconUrl": "https://example.com/icons/tech.png"
    },
    "organizer": {
      "id": "550e8400-e29b-41d4-a716-446655440008",
      "name": "Tech Leaders",
      "email": "contact@techleaders.com",
      "phone": "0912345678"
    }
  },
  "listErrors": [  ]
}
```
Note: `openTime`/`closedTime` format: "HH:mm" or "HH:mm:ss". `locations` optional. EventId/OrganizerId/CategoryId are GUIDs.

---

**GET /api/events - EventGetListQuery:**

Query Parameters:
```json
{
  "pageNumber": 1,
  "pageSize": 20,
  "name": null,
  "slug": null,
  "subtitle": null,
  "description": null,
  "tags": null,
  "startTime": null,
  "endTime": null,
  "status": null,
  "categoryId": null,
  "organizerId": null,
  "ageRestriction": null,
  "fields": "id,name,slug,description,thumbnailUrl",
  "isDescending": false,
  "isDeleted": false,
  "hasCategory": false,
  "hasOrganizer": false,
  "hasLocations": false
}
```

**EventGetListResponse:**
```json
{
  "isSuccess": true,
  "message": "Retrieve Event Successfully",
  "data": {
    "totalItems": 250,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 13,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440009",
        "name": "Tech Conference 2024",
        "slug": "tech-conference-2024",
        "subtitle": "Future of Technology",
        "description": "Join us...",
        "status": 1,
        "thumbnailUrl": "https://example.com/thumb.jpg",
        "category": {
          "id": "550e8400-e29b-41d4-a716-446655440007",
          "name": "Technology"
        },
        "organizer": {
          "id": "550e8400-e29b-41d4-a716-446655440008",
          "name": "Tech Leaders"
        }
      }
    ]
  },
  "listErrors": []
}
```

---

**GET /api/events/{id} - EventGetByIdQuery:**

Query Parameters:
```json
{
  "fields": "id,name,slug,description,category,organizer,locations",
  "hasCategory": false,
  "hasOrganizer": false,
  "hasLocations": false
}
```

**EventGetByIdResponse:**
```json
{
  "isSuccess": true,
  "message": "Get Event By Id Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440009",
    "name": "Tech Conference 2024",
    "slug": "tech-conference-2024",
    "subtitle": "Future of Technology",
    "description": "Join us for an exciting tech conference...",
    "tags": [
      { "tagName": "Technology" },
      { "tagName": "Conference" }
    ],
    "startTime": "2024-06-01T09:00:00Z",
    "endTime": "2024-06-01T17:00:00Z",
    "openTime": "09:00",
    "closedTime": "17:00",
    "status": 2,
    "thumbnailUrl": "https://example.com/thumb.jpg",
    "bannerUrl": "https://example.com/banner.jpg",
    "ageRestriction": 18,
    "category": {
      "id": "550e8400-e29b-41d4-a716-446655440007",
      "name": "Technology",
      "iconUrl": "https://example.com/icons/tech.png"
    },
    "organizer": {
      "id": "550e8400-e29b-41d4-a716-446655440008",
      "name": "Tech Leaders",
      "email": "contact@techleaders.com",
      "phone": "0912345678"
    },
    "locations": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "name": "Tech Conference 2024",
        "address": "123 Tech Street",
        "province": "Ho Chi Minh City",
        "latitude": 10.8231,
        "longitude": 106.6883
      }
    ]
  },
  "listErrors": []
}
```

---

**PUT /api/events/{id} - EventUpdateCommand:**

```json
{
  "name": "Tech Conference 2024 - Updated",
  "slug": "tech-conference-2024",
  "subtitle": "Future of Technology and Innovation",
  "description": "Updated description...",
  "tags": [
    { "tagName": "Technology" },
    { "tagName": "Conference" }
  ],
  "startTime": "2024-06-05T09:00:00Z",
  "endTime": "2024-06-05T18:00:00Z",
  "openTime": "09:00",
  "closedTime": "18:00",
  "status": 2,
  "thumbnailUrl": "https://example.com/thumb-new.jpg",
  "bannerUrl": "https://example.com/banner-new.jpg",
  "ageRestriction": 16,
  "categoryId": "550e8400-e29b-41d4-a716-446655440007",
  "organizerId": "550e8400-e29b-41d4-a716-446655440008"
}
```

**EventUpdateResponse:**
```json
{
  "isSuccess": true,
  "message": "Update Event Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440009",
    "name": "Tech Conference 2024 - Updated",
    "slug": "tech-conference-2024",
    "subtitle": "Future of Technology and Innovation",
    "status": 2
  },
  "listErrors": []
}
```

---

**DELETE /api/events/{id}:**

**EventDeleteResponse:**
```json
{
  "isSuccess": true,
  "message": "Delete Event Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440009",
    "name": "Tech Conference 2024",
    "slug": "tech-conference-2024",
    "subtitle": "Future of Technology",
    "description": "Join us...",
    "category": { "id": "...", "name": "Technology", "iconUrl": "..." },
    "organizer": { "id": "...", "name": "Tech Leaders", "email": "...", "phone": "..." }
  },
  "listErrors": []
}
```

---

**PATCH /api/events/{id}:**

**EventRestoreResponse:**
```json
{
  "isSuccess": true,
  "message": "Restore Event Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440009",
    "name": "Tech Conference 2024",
    "slug": "tech-conference-2024",
    "category": { "id": "...", "name": "Technology" },
    "organizer": { "id": "...", "name": "Tech Leaders" }
  },
  "listErrors": []
}
```

---

#### 2. Category Controller (`/api/categories`)

**Purpose:** Manage event categories (requires authorization for list).

##### Endpoints:

| HTTP Method | Endpoint | Request | Response | Status Code | Authorization | Notes |
|---|---|---|---|---|---|---|
| **GET** | `/api/categories` | `CategoryGetListQuery` | `CategoryGetListResponse` | 200/400 | Required | Get all categories |
| **GET** | `/api/categories/{id}` | `CategoryGetByIdQuery` | `CategoryGetByIdResponse` | 200/400 | - | Get category by ID |
| **POST** | `/api/categories` | `CategoryCreateCommand` | `CategoryCreateResponse` | 201/400 | - | Create new category |
| **PUT** | `/api/categories/{id}` | `CategoryUpdateCommand` | `CategoryUpdateResponse` | 200/400 | - | Update category |
| **DELETE** | `/api/categories/{id}` | - | `CategoryDeleteResponse` | 200/400 | - | Hard delete category |
| **PATCH** | `/api/categories/{id}` | - | `CategoryRestoreResponse` | 200/400 | - | Restore soft-deleted category |

##### Category Status Enum:
- `1` = Active
- `2` = Inactive

##### Request/Response Models:

**POST /api/categories - CategoryCreateCommand:**

```json
{
  "name": "Music & Concerts",
  "slug": "music-concerts",
  "description": "Live music events and concerts",
  "iconUrl": "https://example.com/icons/music.png",
  "status": 1,
  "parentCategoryId": null
}
```
Note: `status` is StatusEnum (1=Active, 2=Inactive). `parentCategoryId` is GUID string or null.

**CategoryCreateResponse:**
```json
{
  "isSuccess": true,
  "message": "Category created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440011",
    "name": "Music & Concerts",
    "slug": "music-concerts",
    "description": "Live music events and concerts",
    "iconUrl": "https://example.com/icons/music.png",
    "status": 1,
    "parentCategory": null,
    "subCategories": []
  },
  "listErrors": []
}
```

---

**GET /api/categories - CategoryGetListQuery:**

Query Parameters:
```json
{
  "pageNumber": 1,
  "pageSize": 50,
  "name": null,
  "slug": null,
  "description": null,
  "status": null,
  "parentCategoryId": null,
  "fields": "id,name,slug,description",
  "hasParent": false,
  "hasSub": false,
  "isDescending": null,
  "isDeleted": false
}
```

**CategoryGetListResponse:**
```json
{
  "isSuccess": true,
  "message": "Categories retrieved successfully",
  "data": {
    "totalItems": 2,
    "pageNumber": 1,
    "pageSize": 50,
    "totalPages": 1,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440007",
        "name": "Technology",
        "slug": "technology",
        "description": "Tech conferences and workshops",
        "iconUrl": "https://example.com/icons/tech.png",
        "status": 1,
        "parentCategory": null,
        "subCategories": []
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440011",
        "name": "Music & Concerts",
        "slug": "music-concerts",
        "description": "Live music events and concerts",
        "iconUrl": "https://example.com/icons/music.png",
        "status": 1,
        "parentCategory": null,
        "subCategories": []
      }
    ]
  },
  "listErrors": []
}
```

---

**GET /api/categories/{id} - CategoryGetByIdQuery:**

**CategoryGetByIdResponse:**
```json
{
  "isSuccess": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440007",
    "name": "Technology",
    "slug": "technology",
    "description": "Tech conferences and workshops",
    "iconUrl": "https://example.com/icons/tech.png",
    "status": 1,
    "parentCategory": null,
    "subCategories": []
  },
  "listErrors": []
}
```

---

**PUT /api/categories/{id} - CategoryUpdateCommand:**

```json
{
  "name": "Music & Concerts",
  "slug": "music-concerts",
  "description": "Updated: Live music events, concerts, and festivals",
  "iconUrl": "https://example.com/icons/music-new.png",
  "status": 1,
  "parentCategoryId": null
}
```

**CategoryUpdateResponse:**
```json
{
  "isSuccess": true,
  "message": "Category updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440011",
    "name": "Music & Concerts",
    "slug": "music-concerts",
    "description": "Updated: Live music events, concerts, and festivals",
    "status": 1
  },
  "listErrors": []
}
```

---

**DELETE /api/categories/{id}:**

**CategoryDeleteResponse:**
```json
{
  "isSuccess": true,
  "message": "Category deleted successfully",
  "data": null,
  "listErrors": []
}
```

---

**PATCH /api/categories/{id}:**

**CategoryRestoreResponse:**
```json
{
  "isSuccess": true,
  "message": "Category restored successfully",
  "data": null,
  "listErrors": []
}
```

---

#### 3. Organizer Controller (`/api/organizers`)

**Purpose:** Manage event organizers.

##### Endpoints:

| HTTP Method | Endpoint | Request | Response | Status Code | Notes |
|---|---|---|---|---|---|
| **GET** | `/api/organizers` | `OrganizerGetListQuery` | `OrganizerGetListResponse` | 200/400 | Get all organizers |
| **GET** | `/api/organizers/{id}` | `OrganizerGetByIdQuery` | `OrganizerGetByIdResponse` | 200/400 | Get organizer by ID |
| **POST** | `/api/organizers` | `OrganizerCreateCommand` | `OrganizerCreateResponse` | 201/400 | Create new organizer |
| **PUT** | `/api/organizers/{id}` | `OrganizerUpdateCommand` | `OrganizerUpdateResponse` | 200/400 | Update organizer |
| **DELETE** | `/api/organizers/{id}` | - | `OrganizerDeleteResponse` | 200/400 | Hard delete organizer |
| **PATCH** | `/api/organizers/{id}` | - | `OrganizerRestoreResponse` | 200/400 | Restore soft-deleted organizer |

##### Organizer Status Enum:
- `1` = Pending
- `2` = Verified
- `3` = Banned

##### Request/Response Models:

**POST /api/organizers - OrganizerCreateCommand:**

```json
{
  "name": "Tech Leaders",
  "slug": "tech-leaders",
  "description": "We organize innovative tech conferences and workshops",
  "logoUrl": "https://example.com/logo.png",
  "bannerUrl": "https://example.com/banner.jpg",
  "email": "contact@techleaders.com",
  "phone": "0912345678",
  "websiteUrl": "https://techleaders.com",
  "facebookUrl": "https://facebook.com/techleaders",
  "instagramUrl": "https://instagram.com/techleaders",
  "tiktokUrl": "https://tiktok.com/@techleaders",
  "address": "123 Tech Street, City",
  "isVerified": false,
  "status": 1
}
```
Note: `status` is OrganizerStatusEnum (1=Pending, 2=Verified, 3=Banned)

**OrganizerCreateResponse:**
```json
{
  "isSuccess": true,
  "message": "Organizer created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440008",
    "name": "Tech Leaders",
    "slug": "tech-leaders",
    "description": "We organize innovative tech conferences and workshops",
    "logoUrl": "https://example.com/logo.png",
    "bannerUrl": "https://example.com/banner.jpg",
    "email": "contact@techleaders.com",
    "phone": "0912345678",
    "websiteUrl": "https://techleaders.com",
    "facebookUrl": "https://facebook.com/techleaders",
    "instagramUrl": "https://instagram.com/techleaders",
    "tiktokUrl": "https://tiktok.com/@techleaders",
    "address": "123 Tech Street, City",
    "isVerified": false,
    "status": 1,
    "createdAt": "2024-02-16T10:30:00Z",
    "updatedAt": null,
    "events": []
  },
  "listErrors": []
}
```

---

**GET /api/organizers - OrganizerGetListQuery:**

Query Parameters:
```json
{
  "pageNumber": 1,
  "pageSize": 20,
  "name": null,
  "slug": null,
  "description": null,
  "email": null,
  "phone": null,
  "mediaUrl": null,
  "address": null,
  "isVerified": null,
  "status": null,
  "fields": "id,name,slug,email,phone",
  "isDescending": false,
  "isDeleted": false,
  "hasEvents": false
}
```

**OrganizerGetListResponse:**
```json
{
  "isSuccess": true,
  "message": "Organizers retrieved successfully",
  "data": {
    "totalItems": 50,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 3,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440008",
        "name": "Tech Leaders",
        "slug": "tech-leaders",
        "email": "contact@techleaders.com",
        "phone": "0912345678",
        "status": 1
      }
    ]
  },
  "listErrors": []
}
```

---

**PUT /api/organizers/{id} - OrganizerUpdateCommand:**

```json
{
  "name": "Tech Leaders International",
  "slug": "tech-leaders-intl",
  "description": "Global tech conference organizer",
  "logoUrl": "https://example.com/logo-new.png",
  "bannerUrl": "https://example.com/banner-new.jpg",
  "email": "info@techleaders.com",
  "phone": "0912345679",
  "websiteUrl": "https://techleaders.com",
  "facebookUrl": "https://facebook.com/techleaders",
  "instagramUrl": "https://instagram.com/techleaders",
  "tiktokUrl": "https://tiktok.com/@techleaders",
  "address": "456 Tech Avenue, City",
  "isVerified": true,
  "status": 2
}
```
Note: `status` is OrganizerStatusEnum (1=Pending, 2=Verified, 3=Banned)

**OrganizerUpdateResponse:**
```json
{
  "isSuccess": true,
  "message": "Organizer updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440008",
    "name": "Tech Leaders International",
    "email": "info@techleaders.com",
    "status": 2
  },
  "listErrors": []
}
```

---

**GET /api/organizers/{id} - OrganizerGetByIdQuery:**

**OrganizerGetByIdResponse:**
```json
{
  "isSuccess": true,
  "message": "Organizer retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440008",
    "name": "Tech Leaders",
    "slug": "tech-leaders",
    "description": "We organize innovative tech conferences and workshops",
    "logoUrl": "https://example.com/logo.png",
    "email": "contact@techleaders.com",
    "phone": "0912345678",
    "websiteUrl": "https://techleaders.com",
    "isVerified": true,
    "status": 2,
    "createdAt": "2024-02-16T10:30:00Z",
    "updatedAt": "2024-02-16T15:45:00Z",
    "events": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440009",
        "name": "Tech Conference 2024"
      }
    ]
  },
  "listErrors": []
}
```

---

**DELETE /api/organizers/{id}:**

**OrganizerDeleteResponse:**
```json
{
  "isSuccess": true,
  "message": "Organizer deleted successfully",
  "data": null,
  "listErrors": []
}
```

---

**PATCH /api/organizers/{id}:**

**OrganizerRestoreResponse:**
```json
{
  "isSuccess": true,
  "message": "Organizer restored successfully",
  "data": null,
  "listErrors": []
}
```

---

#### 4. Event Review Controller (`/api/eventreviews`)

**Purpose:** Manage user reviews for events.

##### Endpoints:

| HTTP Method | Endpoint | Request | Response | Status Code | Notes |
|---|---|---|---|---|---|
| **GET** | `/api/eventreviews` | `EventReviewGetListQuery` | `EventReviewGetListResponse` | 200/400 | Get reviews (paginated) |
| **GET** | `/api/eventreviews/{id}` | `EventReviewGetByIdQuery` | `EventReviewGetByIdResponse` | 200/400 | Get review by ID |
| **POST** | `/api/eventreviews` | `EventReviewCreateCommand` | `EventReviewCreateResponse` | 201/400 | Create new review |
| **PUT** | `/api/eventreviews/{id}` | `EventReviewUpdateCommand` | `EventReviewUpdateResponse` | 200/400 | Update review |
| **DELETE** | `/api/eventreviews/{id}` | - | `EventReviewDeleteResponse` | 200/400 | Hard delete review |
| **PATCH** | `/api/eventreviews/{id}` | - | `EventReviewRestoreResponse` | 200/400 | Restore soft-deleted review |

##### Request/Response Models:

**POST /api/eventreviews - EventReviewCreateCommand:**

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440009",
  "userId": "550e8400-e29b-41d4-a716-446655440002",
  "rating": 5,
  "comment": "Excellent event! Great organization and amazing speakers.",
  "parentReviewId": null
}
```

**EventReviewCreateResponse:**
```json
{
  "isSuccess": true,
  "message": "Review created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440012",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "fullName": "Jane Smith",
      "avatarUrl": "https://example.com/avatar.jpg",
      "gender": 1
    },
    "event": {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "name": "Tech Conference 2024",
      "slug": "tech-conference-2024",
      "description": "Join us for an exciting tech conference...",
      "subtitle": "Future of Technology"
    },
    "rating": 5,
    "comment": "Excellent event! Great organization and amazing speakers.",
    "parentReview": null
  },
  "listErrors": []
}
```

---

**GET /api/eventreviews - EventReviewGetListQuery:**

Query Parameters:
```json
{
  "pageNumber": 1,
  "pageSize": 20,
  "eventId": "550e8400-e29b-41d4-a716-446655440009",
  "userId": null,
  "rating": 5,
  "comment": null,
  "fields": "id,rating,comment,user,event",
  "isDescending": true,
  "isDeleted": false,
  "hasParent": false,
  "hasReplies": false
}
```

**EventReviewGetListResponse:**
```json
{
  "isSuccess": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "totalItems": 45,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 3,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440012",
        "user": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "fullName": "Jane Smith",
          "avatarUrl": "https://example.com/avatar.jpg",
          "gender": 1
        },
        "event": {
          "id": "550e8400-e29b-41d4-a716-446655440009",
          "name": "Tech Conference 2024",
          "slug": "tech-conference-2024",
          "description": "Join us...",
          "subtitle": "Future of Technology"
        },
        "rating": 5,
        "comment": "Excellent event!"
      }
    ]
  },
  "listErrors": []
}
```

---

**PUT /api/eventreviews/{id} - EventReviewUpdateCommand:**

```json
{
  "rating": 4,
  "comment": "Great event with minor organization issues"
}
```

**EventReviewUpdateResponse:**
```json
{
  "isSuccess": true,
  "message": "Review updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440012",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "fullName": "Jane Smith",
      "avatarUrl": "https://example.com/avatar.jpg",
      "gender": 1
    },
    "event": {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "name": "Tech Conference 2024",
      "slug": "tech-conference-2024",
      "description": "Join us...",
      "subtitle": "Future of Technology"
    },
    "rating": 4,
    "comment": "Great event with minor organization issues"
  },
  "listErrors": []
}
```

---

**DELETE /api/eventreviews/{id}:**

**EventReviewDeleteResponse:**
```json
{
  "isSuccess": true,
  "message": "Review deleted successfully",
  "data": null,
  "listErrors": []
}
```

---

**PATCH /api/eventreviews/{id}:**

**EventReviewRestoreResponse:**
```json
{
  "isSuccess": true,
  "message": "Review restored successfully",
  "data": null,
  "listErrors": []
}
```

---

#### 5. Favorite Controller (`/api/favorites`)

**Purpose:** Manage user's favorite events.

##### Endpoints:

| HTTP Method | Endpoint | Request | Response | Status Code | Notes |
|---|---|---|---|---|---|
| **GET** | `/api/favorites` | `FavoriteGetListQuery` | `FavoriteGetListResponse` | 200/400 | Get user's favorites (paginated) |
| **GET** | `/api/favorites/{id}` | `FavoriteGetByIdQuery` | `FavoriteGetByIdResponse` | 200/400 | Get favorite by ID |
| **POST** | `/api/favorites` | `FavoriteCreateCommand` | `FavoriteCreateResponse` | 201/400 | Add event to favorites |
| **DELETE** | `/api/favorites/{userId}/{eventId}` | - | `FavoriteDeleteResponse` | 200/400 | Hard delete from favorites |
| **DELETE** | `/api/favorites/{userId}/{eventId}/soft` | - | `FavoriteSoftDeleteResponse` | 200/400 | Soft delete from favorites |
| **PATCH** | `/api/favorites/{userId}/{eventId}` | - | `FavoriteRestoreResponse` | 200/400 | Restore favorite |

##### Request/Response Models:

**POST /api/favorites - FavoriteCreateCommand:**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440002",
  "eventId": "550e8400-e29b-41d4-a716-446655440009"
}
```

**FavoriteCreateResponse:**
```json
{
  "isSuccess": true,
  "message": "Event added to favorites successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440013",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "fullName": "Jane Smith",
      "avatarUrl": "https://example.com/avatar.jpg",
      "gender": 1
    },
    "event": {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "name": "Tech Conference 2024",
      "slug": "tech-conference-2024",
      "description": "Join us for an exciting tech conference...",
      "subtitle": "Future of Technology"
    }
  },
  "listErrors": []
}
```

---

**GET /api/favorites - FavoriteGetListQuery:**

Query Parameters:
```json
{
  "pageNumber": 1,
  "pageSize": 20,
  "userId": "550e8400-e29b-41d4-a716-446655440002",
  "eventId": null,
  "fields": "id,user,event",
  "isDescending": true,
  "isDeleted": false
}
```

**FavoriteGetListResponse:**
```json
{
  "isSuccess": true,
  "message": "Favorites retrieved successfully",
  "data": {
    "totalItems": 12,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 1,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440013",
        "user": {
          "id": "550e8400-e29b-41d4-a716-446655440002"
        },
        "event": {
          "id": "550e8400-e29b-41d4-a716-446655440009",
          "name": "Tech Conference 2024",
          "slug": "tech-conference-2024",
          "description": "Join us for an exciting tech conference...",
          "subtitle": "Future of Technology"
        }
      }
    ]
  },
  "listErrors": []
}
```

---

**GET /api/favorites/{id} - FavoriteGetByIdQuery:**

**FavoriteGetByIdResponse:**
```json
{
  "isSuccess": true,
  "message": "Favorite retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440013",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "fullName": "Jane Smith",
      "avatarUrl": "https://example.com/avatar.jpg",
      "gender": 1
    },
    "event": {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "name": "Tech Conference 2024",
      "slug": "tech-conference-2024",
      "description": "Join us...",
      "subtitle": "Future of Technology"
    }
  },
  "listErrors": []
}
```

---

**DELETE /api/favorites/{userId}/{eventId}:**

**FavoriteDeleteResponse:**
```json
{
  "isSuccess": true,
  "message": "Favorite deleted successfully",
  "data": null,
  "listErrors": []
}
```

---

**DELETE /api/favorites/{userId}/{eventId}/soft:**

**FavoriteSoftDeleteResponse:**
```json
{
  "isSuccess": true,
  "message": "Favorite removed from list",
  "data": null,
  "listErrors": []
}
```

---

**PATCH /api/favorites/{userId}/{eventId}:**

**FavoriteRestoreResponse:**
```json
{
  "isSuccess": true,
  "message": "Favorite restored successfully",
  "data": null,
  "listErrors": []
}
```

---

#### 6. Event Interaction Controller (`/api/interactions`)

**Purpose:** Manage user interactions with events (likes, shares, views, etc.).

##### Endpoints:

| HTTP Method | Endpoint | Request | Response | Status Code | Notes |
|---|---|---|---|---|---|
| **GET** | `/api/interactions` | `InteractionGetListQuery` | `InteractionGetListResponse` | 200/400 | Get interactions (paginated) |
| **GET** | `/api/interactions/{id}` | `InteractionGetByIdQuery` | `InteractionGetByIdResponse` | 200/400 | Get interaction by ID |
| **POST** | `/api/interactions` | `InteractionCreateCommand` | `InteractionCreateResponse` | 201/400 | Record user interaction |
| **DELETE** | `/api/interactions/{userId}/{eventId}/{type}` | - | `InteractionDeleteResponse` | 200/400 | Hard delete interaction |
| **DELETE** | `/api/interactions/{userId}/{eventId}/{type}/soft` | - | `InteractionSoftDeleteResponse` | 200/400 | Soft delete interaction |
| **PATCH** | `/api/interactions/{userId}/{eventId}/{type}` | - | `InteractionRestoreResponse` | 200/400 | Restore interaction |

##### Interaction Types (Enum values):
- `1` = View
- `2` = Heart
- `3` = Save

##### Request/Response Models:

**POST /api/interactions - InteractionCreateCommand:**

```json
{
  "type": 1,
  "eventId": "550e8400-e29b-41d4-a716-446655440009",
  "userId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**InteractionCreateResponse:**
```json
{
  "isSuccess": true,
  "message": "Interaction recorded successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440014",
    "type": 1,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "fullName": "Jane Smith",
      "avatarUrl": "https://example.com/avatar.jpg",
      "gender": 1
    },
    "event": {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "name": "Tech Conference 2024",
      "slug": "tech-conference-2024",
      "description": "Join us for an exciting tech conference...",
      "subtitle": "Future of Technology"
    }
  },
  "listErrors": []
}
```

---

**GET /api/interactions - InteractionGetListQuery:**

Query Parameters:
```json
{
  "pageNumber": 1,
  "pageSize": 50,
  "userId": null,
  "eventId": "550e8400-e29b-41d4-a716-446655440009",
  "type": null,
  "fields": "id,type,user,event",
  "isDescending": true,
  "isDeleted": false
}
```

**InteractionGetListResponse:**
```json
{
  "isSuccess": true,
  "message": "Interactions retrieved successfully",
  "data": {
    "totalItems": 234,
    "pageNumber": 1,
    "pageSize": 50,
    "totalPages": 5,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440014",
        "type": 1,
        "user": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "fullName": "Jane Smith",
          "avatarUrl": "https://example.com/avatar.jpg",
          "gender": 1
        },
        "event": {
          "id": "550e8400-e29b-41d4-a716-446655440009",
          "name": "Tech Conference 2024",
          "slug": "tech-conference-2024",
          "description": "Join us...",
          "subtitle": "Future of Technology"
        }
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440015",
        "type": 2,
        "user": {
          "id": "550e8400-e29b-41d4-a716-446655440003"
        },
        "event": {
          "id": "550e8400-e29b-41d4-a716-446655440009",
          "name": "Tech Conference 2024"
        }
      }
    ]
  },
  "listErrors": []
}
```

---

**GET /api/interactions/{id} - InteractionGetByIdQuery:**

**InteractionGetByIdResponse:**
```json
{
  "isSuccess": true,
  "message": "Interaction retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440014",
    "type": 1,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "fullName": "Jane Smith",
      "avatarUrl": "https://example.com/avatar.jpg",
      "gender": 1
    },
    "event": {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "name": "Tech Conference 2024",
      "slug": "tech-conference-2024",
      "description": "Join us...",
      "subtitle": "Future of Technology"
    }
  },
  "listErrors": []
}
```

---

**DELETE /api/interactions/{userId}/{eventId}/{type}:**

**InteractionDeleteResponse:**
```json
{
  "isSuccess": true,
  "message": "Interaction deleted successfully",
  "data": null,
  "listErrors": []
}
```

---

**DELETE /api/interactions/{userId}/{eventId}/{type}/soft:**

**InteractionSoftDeleteResponse:**
```json
{
  "isSuccess": true,
  "message": "Interaction removed",
  "data": null,
  "listErrors": []
}
```

---

**PATCH /api/interactions/{userId}/{eventId}/{type}:**

**InteractionRestoreResponse:**
```json
{
  "isSuccess": true,
  "message": "Interaction restored successfully",
  "data": null,
  "listErrors": []
}
```

---

## TICKET SERVICE (Port 6201)

### Controllers and Endpoints

#### 1. Ticket Controller (`/api/tickets`)

**Purpose:** Manage individual tickets for events.

##### Endpoints:

| HTTP Method | Endpoint | Request | Response | Status Code | Notes |
|---|---|---|---|---|---|
| **GET** | `/api/tickets` | `TicketGetListQuery` | `TicketGetListResponse` | 200/400 | Get paginated list of tickets |
| **GET** | `/api/tickets/{id}` | `TicketGetByIdQuery` | `TicketGetByIdResponse` | 200/400 | Get ticket details by ID |
| **POST** | `/api/tickets` | `TicketCreateCommand` | `TicketCreateResponse` | 201/400 | Create new ticket |
| **PUT** | `/api/tickets/{id}` | `TicketUpdateCommand` | `TicketUpdateResponse` | 200/400 | Update ticket information |
| **DELETE** | `/api/tickets/{id}` | - | `TicketDeleteResponse` | 200/400 | Hard delete ticket |
| **PATCH** | `/api/tickets/{id}` | - | `TicketRestoreResponse` | 200/400 | Restore soft-deleted ticket |

##### Ticket Status Enum:
- `1` = Available
- `2` = Full
- `3` = Unavailable
- `4` = Locked

##### Request/Response Models:

**POST /api/tickets - TicketCreateCommand:**

```json
{
  "ticketTypeId": "550e8400-e29b-41d4-a716-446655440020",
  "eventId": "550e8400-e29b-41d4-a716-446655440009",
  "zone": "A1",
  "status": 1
}
```
Note: `eventId` must exist in EventService (gRPC validation). `status` is TicketStatusEnum (1=Available, 2=Full, 3=Unavailable, 4=Locked).

**TicketCreateResponse:**
```json
{
  "isSuccess": true,
  "message": "Create Ticket Type Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440030",
    "ticketType": {
      "id": "550e8400-e29b-41d4-a716-446655440020",
      "name": "VIP",
      "price": 150.00
    },
    "event": {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "name": "Tech Conference 2024"
    },
    "zone": "A1",
    "status": 1,
    "createdAt": "2024-02-16T14:20:00Z"
  },
  "listErrors": []
}
```

---

**GET /api/tickets - TicketGetListQuery:**

Query Parameters:
```json
{
  "pageNumber": 1,
  "pageSize": 50,
  "ticketTypeId": null,
  "eventId": "550e8400-e29b-41d4-a716-446655440009",
  "zone": null,
  "status": null,
  "fields": "id,zone,status,createdAt",
  "hasEvent": false,
  "hasType": false,
  "isDescending": false,
  "isDeleted": false
}
```

**TicketGetListResponse:**
```json
{
  "isSuccess": true,
  "message": "Retrieve Tickets Successfully",
  "data": {
    "totalItems": 500,
    "pageNumber": 1,
    "pageSize": 50,
    "totalPages": 10,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440030",
        "ticketType": {
          "id": "550e8400-e29b-41d4-a716-446655440020",
          "name": "VIP",
          "price": 150.00
        },
        "event": {
          "id": "550e8400-e29b-41d4-a716-446655440009",
          "name": "Tech Conference 2024"
        },
        "zone": "A1",
        "status": 1,
        "createdAt": "2024-02-16T14:20:00Z"
      }
    ]
  },
  "listErrors": []
}
```

---

**GET /api/tickets/{id} - TicketGetByIdQuery:**

Query Parameters:
```json
{
  "fields": "id,zone,status,ticketType,event",
  "hasEvent": true,
  "hasType": true
}
```

**TicketGetByIdResponse:**
```json
{
  "isSuccess": true,
  "message": "Update Ticket Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440030",
    "ticketType": {
      "id": "550e8400-e29b-41d4-a716-446655440020",
      "name": "VIP",
      "price": 150.00,
      "totalQuantity": 100,
      "availableQuantity": 85,
      "description": "VIP access with premium seating"
    },
    "event": {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "name": "Tech Conference 2024",
      "startTime": "2024-06-01T09:00:00Z",
      "endTime": "2024-06-01T17:00:00Z"
    },
    "zone": "A1",
    "status": 1,
    "createdAt": "2024-02-16T14:20:00Z"
  },
  "listErrors": []
}
```

---

**PUT /api/tickets/{id} - TicketUpdateCommand:**

```json
{
  "ticketTypeId": "550e8400-e29b-41d4-a716-446655440020",
  "zone": "B2",
  "status": 2
}
```

**TicketUpdateResponse:**
```json
{
  "isSuccess": true,
  "message": "Update Ticket Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440030",
    "zone": "B2",
    "status": 2
  },
  "listErrors": []
}
```

---

**DELETE /api/tickets/{id}:**

**TicketDeleteResponse:**
```json
{
  "isSuccess": true,
  "message": "Update Ticket Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440030",
    "ticketType": { "id": "...", "name": "VIP", "price": 150.00 },
    "event": { "id": "...", "name": "Tech Conference 2024" },
    "zone": "A1",
    "status": 1,
    "createdAt": "2024-02-16T14:20:00Z"
  },
  "listErrors": []
}
```
Note: Handler returns deleted ticket in data (message typo: says "Update" instead of "Delete").

---

**PATCH /api/tickets/{id}:**

**TicketRestoreResponse:**
```json
{
  "isSuccess": true,
  "message": "Update Ticket Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440030",
    "ticketType": { "id": "...", "name": "VIP" },
    "event": { "id": "...", "name": "Tech Conference 2024" },
    "zone": "A1",
    "status": 1,
    "createdAt": "2024-02-16T14:20:00Z"
  },
  "listErrors": []
}
```
Note: Handler message typo: says "Update" instead of "Restore".

---

#### 2. Ticket Type Controller (`/api/tickettypes`)

**Purpose:** Manage ticket types (categories of tickets) for events.

##### Endpoints:

| HTTP Method | Endpoint | Request | Response | Status Code | Notes |
|---|---|---|---|---|---|
| **GET** | `/api/tickettypes` | `TicketTypeGetListQuery` | `TicketTypeGetListResponse` | 200/400 | Get paginated list of ticket types |
| **GET** | `/api/tickettypes/{id}` | `TicketTypeGetByIdQuery` | `TicketTypeGetByIdResponse` | 200/400 | Get ticket type by ID |
| **POST** | `/api/tickettypes` | `TicketTypeCreateCommand` | `TicketTypeCreateResponse` | 201/400 | Create new ticket type |
| **PUT** | `/api/tickettypes/{id}` | `TicketTypeUpdateCommand` | `TicketTypeUpdateResponse` | 200/400 | Update ticket type |
| **DELETE** | `/api/tickettypes/{id}` | - | `TicketTypeDeleteResponse` | 200/400 | Hard delete ticket type |
| **PATCH** | `/api/tickettypes/{id}` | - | `TicketTypeRestoreResponse` | 200/400 | Restore soft-deleted ticket type |

##### Request/Response Models:

**POST /api/tickettypes - TicketTypeCreateCommand:**

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440009",
  "name": "VIP",
  "price": 150.00,
  "totalQuantity": 100,
  "availableQuantity": 100,
  "description": "VIP access with premium seating and exclusive lounge"
}
```
Note: `eventId` must exist in EventService (gRPC validation). TicketTypeUpdateCommand does NOT have eventId (from path).

**TicketTypeCreateResponse:**
```json
{
  "isSuccess": true,
  "message": "Create Ticket Type Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "event": {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "name": "Tech Conference 2024",
      "slug": "tech-conference-2024",
      "description": "Join us..."
    },
    "name": "VIP",
    "price": 150.00,
    "totalQuantity": 100,
    "availableQuantity": 100,
    "description": "VIP access with premium seating and exclusive lounge",
    "createdAt": "2024-02-16T11:30:00Z"
  },
  "listErrors": []
}
```

---

**GET /api/tickettypes - TicketTypeGetListQuery:**

Query Parameters:
```json
{
  "pageNumber": 1,
  "pageSize": 20,
  "eventId": "550e8400-e29b-41d4-a716-446655440009",
  "name": null,
  "fromPrice": 0.00,
  "toPrice": 1000.00,
  "description": null,
  "fields": "id,name,price,totalQuantity,availableQuantity",
  "isDescending": null,
  "isDeleted": false
}
```

**TicketTypeGetListResponse:**
```json
{
  "isSuccess": true,
  "message": "Retrieve Ticket Types Successfully",
  "data": {
    "totalItems": 4,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 1,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "event": { "id": "550e8400-e29b-41d4-a716-446655440009" },
        "name": "VIP",
        "price": 150.00,
        "totalQuantity": 100,
        "availableQuantity": 85,
        "description": "VIP access with premium seating"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440021",
        "event": { "id": "550e8400-e29b-41d4-a716-446655440009" },
        "name": "Standard",
        "price": 50.00,
        "totalQuantity": 500,
        "availableQuantity": 420,
        "description": "Standard event ticket"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440022",
        "event": { "id": "550e8400-e29b-41d4-a716-446655440009" },
        "name": "Student",
        "price": 30.00,
        "totalQuantity": 200,
        "availableQuantity": 180,
        "description": "Student discount ticket"
      }
    ]
  }
}
```

---

**GET /api/tickettypes/{id} - TicketTypeGetByIdQuery:**

Query Parameters:
```json
{
  "fields": "id,name,price,totalQuantity,availableQuantity,description,event"
}
```

**TicketTypeGetByIdResponse:**
```json
{
  "isSuccess": true,
  "message": "Update Ticket Type Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "name": "VIP",
    "price": 150.00,
    "totalQuantity": 100,
    "availableQuantity": 85,
    "description": "VIP access with premium seating and exclusive lounge access",
    "event": {
      "id": "550e8400-e29b-41d4-a716-446655440009",
      "name": "Tech Conference 2024",
      "slug": "tech-conference-2024",
      "description": "Join us...",
      "startTime": "2024-06-01T09:00:00Z",
      "endTime": "2024-06-01T17:00:00Z"
    },
    "createdAt": "2024-02-16T11:30:00Z"
  },
  "listErrors": []
}
```

---

**PUT /api/tickettypes/{id} - TicketTypeUpdateCommand:**

```json
{
  "name": "VIP Premium",
  "price": 175.00,
  "totalQuantity": 100,
  "availableQuantity": 85,
  "description": "VIP Premium access with extra benefits"
}
```

**TicketTypeUpdateResponse:**
```json
{
  "isSuccess": true,
  "message": "Update Ticket Type Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "name": "VIP Premium",
    "price": 175.00,
    "totalQuantity": 100,
    "availableQuantity": 85,
    "description": "VIP Premium access with extra benefits"
  },
  "listErrors": []
}
```

---

**DELETE /api/tickettypes/{id}:**

**TicketTypeDeleteResponse:**
```json
{
  "isSuccess": true,
  "message": "Update Ticket Type Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "name": "VIP",
    "price": 150.00,
    "totalQuantity": 100,
    "availableQuantity": 85,
    "description": "VIP access",
    "event": { "id": "...", "name": "Tech Conference 2024" },
    "createdAt": "2024-02-16T11:30:00Z"
  },
  "listErrors": []
}
```
Note: Handler message typo: says "Update" instead of "Delete".

---

**PATCH /api/tickettypes/{id}:**

**TicketTypeRestoreResponse:**
```json
{
  "isSuccess": true,
  "message": "Update Ticket Type Successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "name": "VIP",
    "price": 150.00,
    "event": { "id": "...", "name": "Tech Conference 2024" },
    "createdAt": "2024-02-16T11:30:00Z"
  },
  "listErrors": []
}
```
Note: Handler message typo: says "Update" instead of "Restore".

---

## OPERATION SERVICE (Port 6501)

### Controllers and Endpoints

#### 1. Notification Controller (`/api/notifications`)

**Purpose:** Quản lý thông báo cho người dùng.

##### Endpoints:

| HTTP Method | Endpoint | Request | Response | Status Code | Notes |
|---|---|---|---|---|---|
| **GET** | `/api/notifications` | `NotificationGetListQuery` | `NotificationGetListResponse` | 200/400 | Danh sách thông báo |
| **GET** | `/api/notifications/{id}` | `NotificationGetByIdQuery` | `NotificationGetByIdResponse` | 200/400 | Chi tiết thông báo |
| **POST** | `/api/notifications` | `NotificationCreateCommand` | `NotificationCreateResponse` | 201/400 | Tạo thông báo |
| **PUT** | `/api/notifications/{id}` | `NotificationUpdateCommand` | `NotificationUpdateResponse` | 200/400 | Cập nhật thông báo |
| **DELETE** | `/api/notifications/{id}` | - | `NotificationDeleteResponse` | 200/400 | Xóa thông báo |
| **PATCH** | `/api/notifications/{id}` | - | `NotificationRestoreResponse` | 200/400 | Khôi phục thông báo |

##### NotificationCreateCommand:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440002",
  "eventId": "550e8400-e29b-41d4-a716-446655440009",
  "title": "Event Reminder",
  "message": "Your event starts in 1 hour"
}
```

##### NotificationDTO (Response):
- id, user, event, title, message, isRead

##### NotificationGetListQuery params:
- userId, eventId, title, message, isRead, fields, isDescending, isDeleted, hasUser, hasEvent

---

#### 2. CheckIn Controller (`/api/checkins`)

**Purpose:** Quản lý check-in sự kiện.

##### Endpoints:

| HTTP Method | Endpoint | Request | Response | Status Code | Notes |
|---|---|---|---|---|---|
| **GET** | `/api/checkins` | `CheckInGetListQuery` | `CheckInGetListResponse` | 200/400 | Danh sách check-in |
| **GET** | `/api/checkins/{id}` | `CheckInGetByIdQuery` | `CheckInGetByIdResponse` | 200/400 | Chi tiết check-in |
| **POST** | `/api/checkins` | `CheckInCreateCommand` | `CheckInCreateResponse` | 201/400 | Tạo check-in |
| **PUT** | `/api/checkins/{id}` | `CheckInUpdateCommand` | `CheckInUpdateResponse` | 200/400 | Cập nhật check-in |
| **DELETE** | `/api/checkins/{id}` | - | `CheckInDeleteResponse` | 200/400 | Xóa check-in |
| **PATCH** | `/api/checkins/{id}` | - | `CheckInRestoreResponse` | 200/400 | Khôi phục check-in |

##### CheckInCreateCommand:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440002",
  "eventId": "550e8400-e29b-41d4-a716-446655440009",
  "bookingDetailId": "550e8400-e29b-41d4-a716-446655440050",
  "ticketId": "550e8400-e29b-41d4-a716-446655440030",
  "checkInAt": "2024-06-01T09:00:00Z",
  "checkByUserId": "550e8400-e29b-41d4-a716-446655440001"
}
```

##### CheckInGetListQuery params:
- userId, eventId, bookingDetailId, ticketId, checkInAt, checkByUserId, fields, isDescending, isDeleted, hasUser, hasEvent, hasBooking, hasTicket

---

## Response Structure

All responses follow a standardized wrapper structure. HTTP status code is returned in the response header (e.g., 200, 201, 400).

```json
{
  "isSuccess": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  },
  "listErrors": [
    {
      "field": "email",
      "detail": "Email already exists"
    }
  ]
}
```

### Pagination Response Structure (for list endpoints):

```json
{
  "totalItems": 100,
  "pageNumber": 1,
  "pageSize": 20,
  "totalPages": 5,
  "items": [ /* array of items */ ]
}
```

### Error Response Format:

```json
{
  "isSuccess": false,
  "message": "Operation failed",
  "data": null,
  "listErrors": [
    {
      "field": "fieldName",
      "detail": "Error description"
    }
  ]
}
```

---

## Common Query Parameters

Most list endpoints support these pagination and filtering parameters:

- **pageNumber** (int): Page number (default: 1)
- **pageSize** (int): Items per page (default: 10)
- **fields** (string): Comma-separated field names to include
- **isDeleted** (bool): Include soft-deleted items
- **isDescending** (bool): Sort in descending order

### Enum Serialization Note

Enums (Status, Type, etc.) are serialized as **integers** in JSON responses. Refer to the enum definitions in each section (e.g., Ticket Status: 1=Available, 2=Full; Interaction Types: 1=View, 2=Heart, 3=Save).

---

## Soft Delete vs Hard Delete

- **Soft Delete (DELETE `/path/soft` or implied):** Marks record as deleted but preserves data
- **Hard Delete (DELETE `/path`):** Permanently removes record from database
- **Restore (PATCH `/path`):** Recovers soft-deleted records

---

## Status Codes Summary

| Code | Meaning |
|---|---|
| **200** | OK - Request successful |
| **201** | Created - Resource successfully created |
| **400** | Bad Request - Invalid input or operation failed |
| **401** | Unauthorized - Missing or invalid token |
| **403** | Forbidden - User lacks permissions |
| **404** | Not Found - Resource doesn't exist |
| **500** | Internal Server Error |

---

## Architecture Notes

- **CQRS Pattern:** Commands (write operations) and Queries (read operations) are separated
- **MediatR:** Used for handling requests through pipelines and handlers
- **DTOs:** Data Transfer Objects for request/response serialization
- **Entity Framework Core:** ORM for database operations
- **Multi-tenant Support:** System supports location-based data filtering
- **Soft Delete:** Records are marked as deleted rather than permanently removed

---

## Docker Deployment

Services are containerized and can be deployed via `docker-compose.yml`:

```bash
docker-compose up
```

All services will start on their designated ports and register with the API Gateway.

---

## Integration Events

Services communicate asynchronously through integration events via RabbitMQ/Message Bus:

- **SendOtpRegisterEvent:** Triggered when user registers
- **SendChangeEmailEmailEvent:** Triggered when email change is verified
- **SendFirstLoginGoogleEmailEvent:** Triggered on first Google login
- **SendForgotPasswordEmailEvent:** Triggered when password reset requested
- Custom domain events for each service operation

---

## Client Integration Examples

### Authentication Flow:

1. User registers: `POST /api/auth/register`
2. Verify email: `POST /api/auth/verify-register`
3. User logs in: `POST /api/auth/login`
4. Receive JWT token in response
5. Include token in subsequent requests: `Authorization: Bearer <token>`

### Event Discovery:

1. Browse categories: `GET /api/categories`
2. List events: `GET /api/events?pageNumber=1&pageSize=20`
3. Get event details: `GET /api/events/{eventId}`
4. View event reviews: `GET /api/eventreviews?eventId={eventId}`

### Ticket Purchase:

1. Get ticket types: `GET /api/tickettypes?eventId={eventId}`
2. Get payment methods: `GET /api/paymentmethods`
3. Get user bookings: `GET /api/bookings`
4. Receive tickets: `GET /api/tickets?eventId={eventId}&status=2`

**Lưu ý:** BookingService và PaymentService hiện chỉ có GET (list). API tạo booking và thanh toán có thể chưa được triển khai.
