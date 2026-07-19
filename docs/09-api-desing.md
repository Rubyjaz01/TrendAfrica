# TrendAfrica API Design
## 1. API Overview

### Architecture

TrendAfrica uses a RESTful API architecture for communication between the frontend and backend.

---

### Base URL

```
/api/v1
```

---

### Data Format

- Request Format: JSON
- Response Format: JSON

---

### API Versioning

The API is versioned using the URL path.

Example:

```
/api/v1/auth/login
/api/v1/campaigns
/api/v1/users/profile
```

Future versions may use:

```
/api/v2
```

without affecting existing clients.

---

### Security

The API follows these security principles:

- JWT Authentication
- Password Hashing using bcrypt
- HTTPS for all production requests
- Role-Based Access Control (RBAC)
- Input Validation
- Rate Limiting
- Secure HTTP Headers

## 2. Standard API Response Format

### Successful Response

Every successful API response follows this structure:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

---

### Error Response

Every failed API response follows this structure:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Email is required."
    }
  ]
}
```

---

### HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 500 | Internal Server Error |

## 3. Authentication API

### 3.1 Register User

**Endpoint**

```
POST /api/v1/auth/register
```

**Authentication Required**

No

**Request Body**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "StrongPassword123!",
  "role": "CREATOR"
}
```

**Successful Response**

**Status:** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user_id": "uuid"
  }
}
```

**Possible Errors**

- 400 Bad Request
- 409 Conflict (Email already exists)
- 422 Unprocessable Entity

---

### 3.2 Login User

**Endpoint**

```
POST /api/v1/auth/login
```

**Authentication Required**

No

**Request Body**

```json
{
  "email": "john@example.com",
  "password": "StrongPassword123!"
}
```

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "JWT_TOKEN",
    "user": {}
  }
}
```

**Possible Errors**

- 400 Bad Request
- 401 Unauthorized

---

### 3.3 Logout User

**Endpoint**

```
POST /api/v1/auth/logout
```

**Authentication Required**

Yes (JWT)

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Logout successful."
}
```

---

### 3.4 Get Current User

**Endpoint**

```
GET /api/v1/auth/me
```

**Authentication Required**

Yes (JWT)

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "User retrieved successfully.",
  "data": {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role": "CREATOR"
  }
}
```

**Possible Errors**

- 401 Unauthorized

## 4. Campaign API

### 4.1 Create Campaign

**Endpoint**

```
POST /api/v1/campaigns
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- BRAND

**Request Body**

```json
{
  "title": "Summer Promotion",
  "description": "Promote our new product on social media.",
  "campaign_type": "VIDEO",
  "budget": 500000,
  "reward_per_creator": 5000,
  "max_creators": 100,
  "start_date": "2026-08-01",
  "end_date": "2026-08-31",
  "requirements": "Create a 60-second video."
}
```

**Successful Response**

**Status:** `201 Created`

```json
{
  "success": true,
  "message": "Campaign created successfully.",
  "data": {
    "campaign_id": "uuid"
  }
}
```

**Possible Errors**

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 422 Unprocessable Entity

---

### 4.2 Get All Campaigns

**Endpoint**

```
GET /api/v1/campaigns
```

**Authentication Required**

No

**Query Parameters (Optional)**

- status
- campaign_type
- page
- limit
- search

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Campaigns retrieved successfully.",
  "data": []
}
```

---

### 4.3 Get Campaign by ID

**Endpoint**

```
GET /api/v1/campaigns/{campaignId}
```

**Authentication Required**

No

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Campaign retrieved successfully.",
  "data": {}
}
```

**Possible Errors**

- 404 Not Found

---

### 4.4 Update Campaign

**Endpoint**

```
PUT /api/v1/campaigns/{campaignId}
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- BRAND

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Campaign updated successfully."
}
```

**Possible Errors**

- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

---

### 4.5 Delete Campaign

**Endpoint**

```
DELETE /api/v1/campaigns/{campaignId}
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- BRAND
- ADMIN

**Successful Response**

**Status:** `204 No Content`

## 5. Campaign Participation API

### 5.1 Join Campaign

**Endpoint**

```
POST /api/v1/campaigns/{campaignId}/join
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- CREATOR

**Successful Response**

**Status:** `201 Created`

```json
{
  "success": true,
  "message": "Campaign joined successfully."
}
```

**Possible Errors**

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict (Already joined)

---

### 5.2 Get My Campaigns

**Endpoint**

```
GET /api/v1/my/campaigns
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- CREATOR

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Campaigns retrieved successfully.",
  "data": []
}
```

---

### 5.3 Leave Campaign

**Endpoint**

```
DELETE /api/v1/campaigns/{campaignId}/leave
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- CREATOR

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Campaign left successfully."
}
```

**Possible Errors**

- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

## 6. Submission API

### 6.1 Submit Campaign Content

**Endpoint**

```
POST /api/v1/campaigns/{campaignId}/submissions
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- CREATOR

**Request Body**

```json
{
  "submission_url": "https://res.cloudinary.com/example/video.mp4",
  "submission_type": "VIDEO",
  "notes": "Completed according to campaign requirements."
}
```

**Successful Response**

**Status:** `201 Created`

```json
{
  "success": true,
  "message": "Submission uploaded successfully.",
  "data": {
    "submission_id": "uuid"
  }
}
```

**Possible Errors**

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

---

### 6.2 Get My Submissions

**Endpoint**

```
GET /api/v1/my/submissions
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- CREATOR

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Submissions retrieved successfully.",
  "data": []
}
```

---

### 6.3 Review Submission

**Endpoint**

```
PATCH /api/v1/submissions/{submissionId}/review
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- BRAND

**Request Body**

```json
{
  "status": "APPROVED",
  "feedback": "Excellent work. Approved."
}
```

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Submission reviewed successfully."
}
```

**Possible Errors**

- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

## 7. Wallet & Transactions API

### 7.1 Get My Wallet

**Endpoint**

```
GET /api/v1/my/wallet
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- CREATOR

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Wallet retrieved successfully.",
  "data": {
    "available_balance": 25000,
    "pending_balance": 5000,
    "total_earned": 120000,
    "currency": "NGN"
  }
}
```

---

### 7.2 Get Transaction History

**Endpoint**

```
GET /api/v1/my/transactions
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- CREATOR

**Query Parameters (Optional)**

- page
- limit
- transaction_type
- status

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Transactions retrieved successfully.",
  "data": []
}
```

---

### 7.3 Request Withdrawal

**Endpoint**

```
POST /api/v1/my/withdrawals
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- CREATOR

**Request Body**

```json
{
  "amount": 10000,
  "payment_method": "BANK_TRANSFER",
  "account_details": {
    "bank_name": "Access Bank",
    "account_name": "John Doe",
    "account_number": "0123456789"
  }
}
```

**Successful Response**

**Status:** `201 Created`

```json
{
  "success": true,
  "message": "Withdrawal request submitted successfully.",
  "data": {
    "withdrawal_request_id": "uuid"
  }
}
```

**Possible Errors**

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 422 Unprocessable Entity

## 8. Notifications API

### 8.1 Get My Notifications

**Endpoint**

```
GET /api/v1/my/notifications
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- BRAND
- CREATOR
- ADMIN

**Query Parameters (Optional)**

- page
- limit
- is_read

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Notifications retrieved successfully.",
  "data": []
}
```

---

### 8.2 Mark Notification as Read

**Endpoint**

```
PATCH /api/v1/my/notifications/{notificationId}/read
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- BRAND
- CREATOR
- ADMIN

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Notification marked as read."
}
```

---

### 8.3 Mark All Notifications as Read

**Endpoint**

```
PATCH /api/v1/my/notifications/read-all
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- BRAND
- CREATOR
- ADMIN

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "All notifications marked as read."
}
```
## 9. Reports & Administration API

### 9.1 Submit Report

**Endpoint**

```
POST /api/v1/reports
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- BRAND
- CREATOR

**Request Body**

```json
{
  "reported_user_id": "uuid",
  "submission_id": "uuid",
  "report_type": "SPAM",
  "reason": "This content violates the platform guidelines."
}
```

**Successful Response**

**Status:** `201 Created`

```json
{
  "success": true,
  "message": "Report submitted successfully.",
  "data": {
    "report_id": "uuid"
  }
}
```

---

### 9.2 Get All Reports (Admin)

**Endpoint**

```
GET /api/v1/admin/reports
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- ADMIN

**Query Parameters (Optional)**

- status
- report_type
- page
- limit

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Reports retrieved successfully.",
  "data": []
}
```

---

### 9.3 Review Report

**Endpoint**

```
PATCH /api/v1/admin/reports/{reportId}
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- ADMIN

**Request Body**

```json
{
  "status": "RESOLVED",
  "resolution_notes": "Appropriate action has been taken."
}
```

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Report reviewed successfully."
}
```

---

### 9.4 Approve Withdrawal Request

**Endpoint**

```
PATCH /api/v1/admin/withdrawals/{withdrawalRequestId}
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- ADMIN

**Request Body**

```json
{
  "status": "PAID",
  "review_notes": "Payment processed successfully."
}
```

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Withdrawal request updated successfully."
}
```

---

### 9.5 Get Audit Logs

**Endpoint**

```
GET /api/v1/admin/audit-logs
```

**Authentication Required**

Yes (JWT)

**Authorized Roles**

- ADMIN

**Query Parameters (Optional)**

- action
- entity_type
- page
- limit

**Successful Response**

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Audit logs retrieved successfully.",
  "data": []
}
```

## 10. Authentication & Authorization Rules

### Authentication

Protected endpoints require a valid JWT access token.

The client must include the token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

### Role-Based Access Control (RBAC)

The platform supports three roles:

- ADMIN
- BRAND
- CREATOR

Each endpoint validates both:

- Authentication (Is the user logged in?)
- Authorization (Does the user have permission?)

---

### Public Endpoints

Examples:

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET /api/v1/campaigns
- GET /api/v1/campaigns/{campaignId}

---

### Protected Endpoints

Examples:

- POST /api/v1/campaigns
- POST /api/v1/campaigns/{campaignId}/join
- POST /api/v1/my/withdrawals
- GET /api/v1/my/wallet
## 12. API Testing Strategy

The API will be tested using:

- Postman
- Thunder Client
- Automated integration tests

Each endpoint will be tested for:

- Successful requests
- Invalid input
- Unauthorized access
- Forbidden access
- Resource not found
- Validation errors
- Server errors

Testing ensures that every endpoint behaves consistently and reliably before deployment.