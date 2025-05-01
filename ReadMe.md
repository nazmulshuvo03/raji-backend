## Fields

### User

id, name, email, password, groupId (FK), role, createdAt, updatedAt

### Group

id, name, description, createdAt, updatedAt

### Project

id, name, description, groupId (FK), createdBy (userId FK), createdAt, updatedAt

### Task

id, title, description, projectId (FK), assignedTo (userId FK), status (e.g., todo/in-progress/done), dueDate, createdBy (userId FK), createdAt, updatedAt

## ✅ API STRUCTURE OVERVIEW

### 1. **Auth**

- `POST /api/register` → Register user (creates `User` + `UserCredential`)
- `POST /api/login` → Login user, returns JWT

---

### 2. **Group (Organization)**

- `POST /api/group` → Create a new group (Only admin; sets creator as admin)
- `GET /api/group` → Get current user's group info

---

### 3. **Project**

- `POST /api/project` → Create project (admin only)
- `GET /api/project` → List all projects in current group
- `GET /api/project/:id` → Get one project
- `PUT /api/project/:id` → Update project (admin only)
- `DELETE /api/project/:id` → Delete project (admin only)

---

### 4. **Task**

- `POST /api/task` → Create task under a project (admin only)
- `GET /api/task/project/:projectId` → List tasks by project
- `PUT /api/task/:id` → Update task (admin only or assigned user can update status)
- `DELETE /api/task/:id` → Delete task (admin only)

---

### 5. **User**

- `GET /api/users` → Get all users in current group (admin only)
- `GET /api/user/me` → Get current user profile

---
