# JEMS Project Management System - API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication

All endpoints except `/auth/*` require JWT authentication.

### Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

---

## 1. Authentication APIs

### 1.1 Register User
**POST** `/auth/register`

Create a new user account (Admin by default).

**Request Body:**
```json
{
  "username": "admin",
  "email": "admin@jems.com",
  "password": "admin123",
  "fullName": "Admin User",
  "phoneNumber": "+91-1234567890",
  "roles": ["ADMIN"]
}
```

**Response:** `200 OK`
```json
{
  "message": "User registered successfully!"
}
```

---

### 1.2 Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": "65abc123...",
  "username": "admin",
  "email": "admin@jems.com",
  "fullName": "Admin User",
  "roles": ["ADMIN"]
}
```

---

### 1.3 Validate Token
**GET** `/auth/validate`

Validate JWT token and get user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": "65abc123...",
  "username": "admin",
  "email": "admin@jems.com",
  "fullName": "Admin User",
  "roles": ["ADMIN"],
  "active": true
}
```

---

## 2. Admin APIs

### 2.1 Manager Management

#### 2.1.1 Create Manager
**POST** `/admin/managers`

Create a new manager account.

**Request Body:**
```json
{
  "username": "manager1",
  "email": "manager1@jems.com",
  "password": "manager123",
  "fullName": "Manager One",
  "phoneNumber": "+91-9876543210"
}
```

**Response:** `200 OK`
```json
{
  "id": "65abc456...",
  "username": "manager1",
  "email": "manager1@jems.com",
  "fullName": "Manager One",
  "phoneNumber": "+91-9876543210",
  "roles": ["MANAGER"],
  "active": true,
  "createdAt": "2024-01-15T10:30:00",
  "createdBy": "admin"
}
```

---

#### 2.1.2 Get All Managers
**GET** `/admin/managers`

Retrieve all managers.

**Response:** `200 OK`
```json
[
  {
    "id": "65abc456...",
    "username": "manager1",
    "email": "manager1@jems.com",
    "fullName": "Manager One",
    "roles": ["MANAGER"],
    "active": true
  }
]
```

---

#### 2.1.3 Get Manager by ID
**GET** `/admin/managers/{id}`

**Response:** `200 OK`
```json
{
  "id": "65abc456...",
  "username": "manager1",
  "email": "manager1@jems.com",
  "fullName": "Manager One",
  "phoneNumber": "+91-9876543210",
  "roles": ["MANAGER"],
  "active": true
}
```

---

#### 2.1.4 Update Manager
**PUT** `/admin/managers/{id}`

**Request Body:**
```json
{
  "fullName": "Manager One Updated",
  "email": "manager1.new@jems.com",
  "phoneNumber": "+91-9999999999"
}
```

**Response:** `200 OK`

---

#### 2.1.5 Delete Manager
**DELETE** `/admin/managers/{id}`

Deactivate a manager (soft delete).

**Response:** `200 OK`
```json
{
  "message": "Manager deactivated successfully"
}
```
#### 2.2.5 create employee 
# Create Employee
POST /api/admin/employees
{
"name": "John Doe"
}

# Response
{
"id": "65abc123",
"name": "John Doe",
"active": true,
"createdAt": "2024-01-15T10:30:00",
"createdBy": "admin"
}

# Get All Employees
GET /api/admin/employees
# Returns array of all active employees

---

### 2.2 Machine Management

#### 2.2.1 Create Machine
**POST** `/admin/machines`

Create a new machine project.

**Request Body:**
```json
{
  "machineId": "M-2024-001",
  "machineName": "CNC Milling Machine",
  "machineType": "Manufacturing Equipment",
  "description": "High precision CNC milling machine for automotive parts",
  "clientName": "ABC Industries Pvt Ltd",
  "clientContact": "+91-1234567890",
  "projectStartDate": "2024-01-15T00:00:00",
  "poDate": "2024-01-10T00:00:00",
  "deliveryPeriod": "2024-06-30T00:00:00",
  "assignedManagerId": "65abc456..."
}
```

**Response:** `200 OK`
```json
{
  "id": "65def789...",
  "machineId": "M-2024-001",
  "machineName": "CNC Milling Machine",
  "machineType": "Manufacturing Equipment",
  "description": "High precision CNC milling machine",
  "clientName": "ABC Industries Pvt Ltd",
  "status": "NOT_STARTED",
  "overallProgress": 0,
  "assignedManager": "manager1",
  "assignedManagerId": "65abc456...",
  "tasks": [],
  "createdAt": "2024-01-15T10:30:00",
  "createdBy": "admin",
  "active": true
}
```

---

#### 2.2.2 Get All Machines
**GET** `/admin/machines`

**Response:** `200 OK`
```json
[
  {
    "id": "65def789...",
    "machineId": "M-2024-001",
    "machineName": "CNC Milling Machine",
    "status": "IN_PROGRESS",
    "overallProgress": 45,
    "assignedManager": "manager1"
  }
]
```

---

#### 2.2.3 Get Machine by ID
**GET** `/admin/machines/{machineId}`

Get detailed machine information including all tasks and subtasks.

**Response:** `200 OK`
```json
{
  "id": "65def789...",
  "machineId": "M-2024-001",
  "machineName": "CNC Milling Machine",
  "status": "IN_PROGRESS",
  "overallProgress": 45,
  "tasks": [
    {
      "id": "task-1",
      "stageName": "Design",
      "stageNumber": "1",
      "status": "COMPLETED",
      "progressPercentage": 100,
      "subTasks": [...]
    }
  ]
}
```

---

#### 2.2.4 Update Machine
**PUT** `/admin/machines/{machineId}`

**Request Body:**
```json
{
  "machineName": "CNC Milling Machine Updated",
  "assignedManagerId": "new-manager-id"
}
```

**Response:** `200 OK`

---

#### 2.2.5 Delete Machine
**DELETE** `/admin/machines/{machineId}`

Soft delete a machine (sets active to false).

**Response:** `200 OK`
```json
{
  "message": "Machine deleted successfully"
}
```

---

### 2.3 Task Management

#### 2.3.1 Add Task to Machine
**POST** `/admin/machines/{machineId}/tasks`

Add a new task/stage to a machine.

**Request Body:**
```json
{
  "stageName": "Design",
  "stageNumber": "1",
  "description": "Complete design phase with all specifications",
  "checkedBy": "SD",
  "approvedBy": "JJK",
  "assignedTo": "Chief Designer",
  "startDate": "2024-01-15T00:00:00",
  "endDate": "2024-02-15T00:00:00"
}
```

**Response:** `200 OK` - Returns updated machine with new task

---

#### 2.3.2 Add SubTask to Task
**POST** `/admin/machines/{machineId}/tasks/{taskId}/subtasks`

Add a subtask to an existing task.

**Request Body:**
```json
{
  "name": "Fabrication",
  "description": "Fabricate main body components",
  "assignedEmployee": "John Doe",
  "assignedEmployeeId": "EMP001",
  "startDate": "2024-02-16T00:00:00",
  "endDate": "2024-03-15T00:00:00"
}
```

**Response:** `200 OK` - Returns updated machine

---

### 2.4 Progress Tracking

#### 2.4.1 Get All Progress
**GET** `/admin/progress`

Get progress overview of all machines.

**Response:** `200 OK`
```json
[
  {
    "machineId": "M-2024-001",
    "machineName": "CNC Milling Machine",
    "status": "IN_PROGRESS",
    "overallProgress": 45,
    "completedTasks": 2,
    "totalTasks": 8
  }
]
```

---

#### 2.4.2 Get Machine Progress
**GET** `/admin/progress/{machineId}`

**Response:** `200 OK` - Returns detailed machine with all progress info

---

## 3. Manager APIs

### 3.1 Machine Access

#### 3.1.1 Get All Machines
**GET** `/manager/machines`

**Response:** `200 OK` - List of all machines

---

#### 3.1.2 Get Assigned Machines
**GET** `/manager/machines/assigned`

Get machines assigned to the current logged-in manager.

**Response:** `200 OK`
```json
[
  {
    "id": "65def789...",
    "machineId": "M-2024-001",
    "machineName": "CNC Milling Machine",
    "status": "IN_PROGRESS",
    "overallProgress": 45
  }
]
```

---

#### 3.1.3 Get Working Machines
**GET** `/manager/machines/working`

Get all machines currently in progress.

**Response:** `200 OK`

---

#### 3.1.4 Get Machines by Status
**GET** `/manager/machines/status/{status}`

Status values: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `ON_HOLD`, `CANCELLED`, `DELIVERED`

**Response:** `200 OK`

---

#### 3.1.5 Get Machine Details
**GET** `/manager/machines/{machineId}`

**Response:** `200 OK` - Full machine details with tasks and subtasks

---

### 3.2 Task Management

#### 3.2.1 Update SubTask Status
**PUT** `/manager/machines/{machineId}/tasks/{taskId}/subtasks/{subTaskId}`

Update subtask progress and status.

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "remarks": "Work in progress, facing minor delays due to material shortage",
  "progressPercentage": 50
}
```

**Status Values:**
- `PENDING`
- `IN_PROGRESS`
- `COMPLETED`
- `ON_HOLD`
- `CANCELLED`

**Response:** `200 OK` - Returns updated machine

---

#### 3.2.2 Complete SubTask
**PUT** `/manager/machines/{machineId}/tasks/{taskId}/subtasks/{subTaskId}/complete`

Mark a subtask as completed (sets progress to 100% and status to COMPLETED).

**Request Body:**
```json
{
  "remarks": "Task completed successfully. All quality checks passed."
}
```

**Response:** `200 OK`

---

### 3.3 Progress Tracking

#### 3.3.1 Get Overall Progress
**GET** `/manager/progress`

Get progress of all machines assigned to the manager.

**Response:** `200 OK`

---

#### 3.3.2 Get Machine Progress
**GET** `/manager/progress/{machineId}`

**Response:** `200 OK`

---

### 3.4 Notifications

#### 3.4.1 Get All Notifications
**GET** `/manager/notifications`

**Response:** `200 OK`
```json
[
  {
    "id": "notif-1",
    "title": "New Machine Added",
    "message": "A new machine 'CNC Milling Machine' has been added and assigned to you.",
    "type": "MACHINE_ADDED",
    "relatedMachineId": "M-2024-001",
    "relatedMachineName": "CNC Milling Machine",
    "isRead": false,
    "createdAt": "2024-01-15T10:30:00",
    "sentBy": "admin"
  }
]
```

---

#### 3.4.2 Get Unread Notifications
**GET** `/manager/notifications/unread`

**Response:** `200 OK` - List of unread notifications

---

#### 3.4.3 Get Unread Count
**GET** `/manager/notifications/count`

**Response:** `200 OK`
```json
{
  "count": 5
}
```

---

#### 3.4.4 Mark Notification as Read
**PUT** `/manager/notifications/{notificationId}/read`

**Response:** `200 OK`

---

#### 3.4.5 Mark All as Read
**PUT** `/manager/notifications/mark-all-read`

**Response:** `200 OK`
```json
{
  "message": "All notifications marked as read"
}