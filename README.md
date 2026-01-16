# 📝 Complete Task Manager System

## 📌 System Overview

The **Smart Task Manager System** is a full-stack web application designed to help organizations manage tasks efficiently using **role-based access control**, visual task tracking, and real-time analytics.

The system supports two primary user roles:

### 👨‍💼 Admin
- Create, assign, edit, and delete tasks  
- View all tasks across the organization  
- Access real-time analytics and reports  

### 👤 User
- View assigned tasks  
- Update task status  
- Mark tasks as complete  

---

## 🛠 Technology Stack

### Backend
- **Python FastAPI**
- **SQLite Database**

### Frontend
- **React with TypeScript**
- **CSS for Styling**

### Authentication
- **JWT (JSON Web Tokens)**

---

## 🗄 Database Management

The system uses **SQLite** for lightweight and efficient database operations.

### Responsibilities
- Creates and manages SQLite database connection  
- Defines database schema (Users, Tasks)  
- Automatically creates tables if they do not exist  

---

## ✨ Key Features

### 📋 Task Management
- Drag-and-drop **Kanban board** for visual task handling  
- Task prioritization: **High / Medium / Low**  
- Task status tracking: **To Do / In Progress / Done**  
- Automatic **overdue task detection** based on due dates  

### 🎨 Visual Indicators
- 🟢 **Green** – Completed tasks  
- 🔴 **Red** – Overdue tasks  
- ⚪ **White** – Normal tasks  

### 📊 Analytics Dashboard
- Interactive charts displaying:
  - Task distribution  
  - Completion rates  
  - Priority breakdown  
- Hover-based **tooltips** showing actual task details  

### 🔐 Role-Based Access
- Admin: Create, Edit, Delete, View All Tasks  
- User: View Assigned Tasks, Mark Tasks as Complete  

---

## 📂 Project Structure

```plaintext
task-manager-system/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    
│   │   ├── config.py                  
│   │   ├── database.py               
│   │   │
│   │   ├── models/                    # Database models
│   │   │   ├── user.py
│   │   │   └── task.py
│   │   │
│   │   ├── schemas/                   # Pydantic schemas
│   │   │   ├── auth.py
│   │   │   └── task.py
│   │   │
│   │   ├── routers/                   # API routes
│   │   │   ├── auth.py
│   │   │   ├── admin.py
│   │   │   └── user.py
│   │   │
│   │   ├── services/                  # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── task_service.py
│   │   │   └── analytics_service.py
│   │   │
│   │   └── utils/                     # Utilities
│   │       ├── security.py
│   │       └── dependencies.py
│   │
│   ├── requirements.txt
│   └── task_manager.db
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── favicon.ico
    │
    ├── src/
    │   ├── components/
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── AdminDashboard.tsx
    │   │   ├── UserDashboard.tsx
    │   │   ├── TaskBoard.tsx
    │   │   ├── TaskColumn.tsx
    │   │   ├── DraggableTaskCard.tsx
    │   │   ├── TaskForm.tsx
    │   │   ├── Analytics.tsx
    │   │   └── TaskTooltip.tsx
    │   │
    │   ├── services/
    │   │   ├── api.ts
    │   │   └── auth.ts
    │   │
    │   ├── types/
    │   │   └── index.ts
    │   │
    │   ├── styles/
    │   │   ├── App.css
    │   │   ├── Dashboard.css
    │   │   ├── TaskBoard.css
    │   │   ├── TaskCard.css
    │   │   ├── Form.css
    │   │   └── Tooltip.css
    │   │
    │   ├── App.tsx
    │   ├── index.tsx
    │   └── index.css
    │
    ├── package.json
    └── tsconfig.json
