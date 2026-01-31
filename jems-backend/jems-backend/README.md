# JEMS Project Management System - Backend

A comprehensive Spring Boot REST API for managing machine manufacturing projects at JEMS Machines and Systems, Pune.

## 🚀 Features

### Admin Features
- Create and manage manager accounts
- Add new machines with detailed information
- Add tasks and subtasks to machines
- Assign tasks and employees
- View overall progress of all machines
- Send notifications to managers
- Track project timelines (PO Date, Delivery Period)

### Manager Features
- View all machines and assigned machines
- View current working machines (in progress)
- Update task/subtask status
- Mark tasks as complete with remarks
- Track progress of assigned machines
- Receive and manage notifications
- View detailed machine information

## 🛠️ Technology Stack

- **Java**: 17
- **Spring Boot**: 3.2.1
- **Database**: MongoDB Atlas
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **Authentication**: JWT-based authentication

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MongoDB Atlas account
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd jems-backend
```

### 2. Configure MongoDB

Update `src/main/resources/application.yml`:

```yaml
spring:
  data:
    mongodb:
      uri: mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
      database: jems_project_db
```

Replace:
- `<username>`: Your MongoDB Atlas username
- `<password>`: Your MongoDB Atlas password
- `<cluster-url>`: Your MongoDB cluster URL
- `<database-name>`: Database name (default: jems_project_db)

### 3. Configure JWT Secret (Optional)

You can customize the JWT secret in `application.yml`:

```yaml
jwt:
  secret: your-secret-key-here
  expiration: 86400000 # 24 hours
```

### 4. Build the project

```bash
mvn clean install
```

### 5. Run the application

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## 🔐 Authentication

### Register Admin (First User)

```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@jems.com",
  "password": "admin123",
  "fullName": "Admin User",
  "phoneNumber": "+91-1234567890",
  "roles": ["ADMIN"]
}
```

### Login

```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": "user-id",
  "username": "admin",
  "email": "admin@jems.com",
  "fullName": "Admin User",
  "roles": ["ADMIN"]
}
```

### Using JWT Token

Include the token in the Authorization header for all protected endpoints:

```
Authorization: Bearer <your-jwt-token>
```

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/validate` | Validate JWT token | Public |

### Admin Endpoints

#### Manager Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/managers` | Create new manager |
| GET | `/api/admin/managers` | Get all managers |
| GET | `/api/admin/managers/{id}` | Get manager by ID |
| PUT | `/api/admin/managers/{id}` | Update manager |
| DELETE | `/api/admin/managers/{id}` | Deactivate manager |

**Create Manager Example:**
```json
POST /api/admin/managers
{
  "username": "manager1",
  "email": "manager1@jems.com",
  "password": "manager123",
  "fullName": "Manager One",
  "phoneNumber": "+91-9876543210"
}
```

#### Machine Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/machines` | Create new machine |
| GET | `/api/admin/machines` | Get all machines |
| GET | `/api/admin/machines/{machineId}` | Get machine details |
| PUT | `/api/admin/machines/{machineId}` | Update machine |
| DELETE | `/api/admin/machines/{machineId}` | Delete machine |

**Create Machine Example:**
```json
POST /api/admin/machines
{
  "machineId": "M-2024-001",
  "machineName": "CNC Milling Machine",
  "machineType": "Manufacturing",
  "description": "High precision CNC machine",
  "clientName": "ABC Industries",
  "clientContact": "+91-1234567890",
  "projectStartDate": "2024-01-15T00:00:00",
  "poDate": "2024-01-10T00:00:00",
  "deliveryPeriod": "2024-06-30T00:00:00",
  "assignedManagerId": "manager-id-here"
}
```

#### Task Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/machines/{machineId}/tasks` | Add task to machine |
| POST | `/api/admin/machines/{machineId}/tasks/{taskId}/subtasks` | Add subtask to task |

**Add Task Example:**
```json
POST /api/admin/machines/M-2024-001/tasks
{
  "stageName": "Design",
  "stageNumber": "1",
  "description": "Complete design phase",
  "checkedBy": "SD",
  "approvedBy": "JJK",
  "assignedTo": "Designer Name",
  "startDate": "2024-01-15T00:00:00",
  "endDate": "2024-02-15T00:00:00"
}
```

**Add SubTask Example:**
```json
POST /api/admin/machines/M-2024-001/tasks/{taskId}/subtasks
{
  "name": "Fabrication",
  "description": "Fabricate machine parts",
  "assignedEmployee": "John Doe",
  "assignedEmployeeId": "EMP001",
  "startDate": "2024-02-16T00:00:00",
  "endDate": "2024-03-15T00:00:00"
}
```

#### Progress Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/progress` | Get all machines progress |
| GET | `/api/admin/progress/{machineId}` | Get specific machine progress |

### Manager Endpoints

#### Machine Access

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/machines` | Get all machines |
| GET | `/api/manager/machines/assigned` | Get assigned machines |
| GET | `/api/manager/machines/working` | Get current working machines |
| GET | `/api/manager/machines/status/{status}` | Get machines by status |
| GET | `/api/manager/machines/{machineId}` | Get machine details |

**Machine Status Values:**
- `NOT_STARTED`
- `IN_PROGRESS`
- `COMPLETED`
- `ON_HOLD`
- `CANCELLED`
- `DELIVERED`

#### Task Updates

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/manager/machines/{machineId}/tasks/{taskId}/subtasks/{subTaskId}` | Update subtask |
| PUT | `/api/manager/machines/{machineId}/tasks/{taskId}/subtasks/{subTaskId}/complete` | Complete subtask |

**Update SubTask Example:**
```json
PUT /api/manager/machines/M-2024-001/tasks/{taskId}/subtasks/{subTaskId}
{
  "status": "IN_PROGRESS",
  "remarks": "Work in progress, 50% complete",
  "progressPercentage": 50
}
```

**SubTask Status Values:**
- `PENDING`
- `IN_PROGRESS`
- `COMPLETED`
- `ON_HOLD`
- `CANCELLED`

**Complete SubTask Example:**
```json
PUT /api/manager/machines/M-2024-001/tasks/{taskId}/subtasks/{subTaskId}/complete
{
  "remarks": "Task completed successfully"
}
```

#### Progress Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/progress` | Get progress of assigned machines |
| GET | `/api/manager/progress/{machineId}` | Get specific machine progress |

#### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/notifications` | Get all notifications |
| GET | `/api/manager/notifications/unread` | Get unread notifications |
| GET | `/api/manager/notifications/count` | Get unread count |
| PUT | `/api/manager/notifications/{id}/read` | Mark as read |
| PUT | `/api/manager/notifications/mark-all-read` | Mark all as read |

## 🗂️ Project Structure

```
jems-backend/
├── src/
│   ├── main/
│   │   ├── java/com/jems/projectmanagement/
│   │   │   ├── config/
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── AdminController.java
│   │   │   │   └── ManagerController.java
│   │   │   ├── model/
│   │   │   │   ├── User.java
│   │   │   │   ├── Machine.java
│   │   │   │   ├── Task.java
│   │   │   │   ├── SubTask.java
│   │   │   │   └── Notification.java
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── MachineRepository.java
│   │   │   │   └── NotificationRepository.java
│   │   │   ├── security/
│   │   │   │   ├── JwtUtils.java
│   │   │   │   ├── AuthTokenFilter.java
│   │   │   │   └── UserDetailsServiceImpl.java
│   │   │   ├── service/
│   │   │   │   ├── UserService.java
│   │   │   │   ├── MachineService.java
│   │   │   │   └── NotificationService.java
│   │   │   └── ProjectManagementApplication.java
│   │   └── resources/
│   │       └── application.yml
│   └── test/
├── pom.xml
└── README.md
```

## 🔄 Workflow

### Admin Workflow

1. **Login** as admin
2. **Create managers** for different projects
3. **Add machines** with project details
4. **Add tasks** (Design, DAP, Fabrication, etc.) to machines
5. **Add subtasks** with employee assignments
6. **Assign managers** to machines
7. **Track progress** of all machines

### Manager Workflow

1. **Login** as manager
2. **View notifications** about assigned machines
3. **View assigned machines** and their details
4. **View current working machines**
5. **Update subtask status** and progress
6. **Add remarks** for completed tasks
7. **Mark tasks as complete**
8. **Track overall progress**

## 📊 Data Models

### User
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "fullName": "string",
  "phoneNumber": "string",
  "roles": ["ADMIN" | "MANAGER"],
  "active": boolean,
  "createdAt": "datetime",
  "createdBy": "string"
}
```

### Machine
```json
{
  "id": "string",
  "machineId": "string",
  "machineName": "string",
  "machineType": "string",
  "description": "string",
  "clientName": "string",
  "clientContact": "string",
  "projectStartDate": "datetime",
  "poDate": "datetime",
  "deliveryPeriod": "datetime",
  "tasks": [Task],
  "status": "enum",
  "overallProgress": number,
  "assignedManager": "string",
  "assignedManagerId": "string",
  "createdAt": "datetime",
  "createdBy": "string"
}
```

### Task
```json
{
  "id": "string",
  "stageName": "string",
  "stageNumber": "string",
  "description": "string",
  "subTasks": [SubTask],
  "status": "enum",
  "startDate": "datetime",
  "endDate": "datetime",
  "checkedBy": "string",
  "approvedBy": "string",
  "assignedTo": "string",
  "progressPercentage": number
}
```

### SubTask
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "assignedEmployee": "string",
  "assignedEmployeeId": "string",
  "status": "enum",
  "remarks": "string",
  "startDate": "datetime",
  "endDate": "datetime",
  "completedAt": "datetime",
  "completedBy": "string",
  "progressPercentage": number
}
```

## 🧪 Testing

You can test the API using:
- **Postman**: Import the endpoints and test
- **cURL**: Command-line testing
- **Thunder Client** (VS Code extension)

### Example cURL Commands

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get all machines (with JWT)
curl -X GET http://localhost:8080/api/admin/machines \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security

- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control (RBAC)
- CORS enabled for frontend integration
- Secure endpoints with Spring Security

## 📝 Environment Variables

For production, use environment variables instead of hardcoding:

```bash
export MONGODB_URI="your-mongodb-uri"
export JWT_SECRET="your-secret-key"
```

## 🚀 Deployment

### Build for production

```bash
mvn clean package -DskipTests
```

The JAR file will be in `target/project-management-1.0.0.jar`

### Run production build

```bash
java -jar target/project-management-1.0.0.jar
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB Atlas credentials
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

### JWT Token Issues
- Check token expiration (default: 24 hours)
- Verify JWT secret configuration
- Ensure proper Authorization header format

### Port Already in Use
Change port in `application.yml`:
```yaml
server:
  port: 8081
```

## 📧 Support

For issues and questions:
- Email: support@jems.com
- Project: JEMS Machines and Systems, Pune

## 📄 License

Proprietary - JEMS Machines and Systems, Pune

---

**Developed for**: JEMS Machines and Systems, Pune  
**Version**: 1.0.0  
**Last Updated**: January 2026
