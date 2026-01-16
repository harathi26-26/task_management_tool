Complete Task Manager System  
System Overview :
Smart Task Manager System - a full-stack web application that helps organizations manage tasks efficiently with role-based access control. 
The system has two main user types:
Admins who can create, assign, edit, and delete tasks, plus view analytics
Users who can view their assigned tasks and mark them as complete

Technology Stack:
•	Backend: Python FastAPI + SQLite Database
•	Frontend: React with TypeScript
•	Authentication: JWT (JSON Web Tokens)
•	Styling: CSS

Database Management :
Handles all SQLite database operations.
-	Creates SQLite connection
-	Defines database schema (tables)
-	Auto-creates tables if they don't exist

Key features 
Drag-and-drop Kanban board for visual task management
Color-coded task cards - green for completed, red for overdue, white for normal
Real-time analytics dashboard with interactive charts showing task distribution, completion rates, and priority breakdowns
Interactive tooltips - hover over analytics cards to see actual task details
Task prioritization (High/Medium/Low) and status tracking (To Do/In Progress/Done)
Overdue task detection that automatically flags tasks past their due date
Admin can: Create, Edit, Delete, View All Tasks
User can: View Assigned Tasks, Mark Complete

task-manager-system/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    
│   │   ├── config.py                  
│   │   ├── database.py                
│   │   │
│   │   ├── models/                    
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   └── task.py
│   │   │
│   │   ├── schemas/                   
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   └── task.py
│   │   │
│   │   ├── routers/                  
│   │   │   ├── __init__.py
│   │   │   ├── auth.py               
│   │   │   ├── admin.py              
│   │   │   └── user.py               
│   │   │
│   │   ├── services/                  
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── task_service.py
│   │   │   └── analytics_service.py
│   │   │
│   │   └── utils/                     
│   │       ├── __init__.py
│   │       ├── security.py           
│   │       └── dependencies.py       
│   │
│   ├── requirements.txt
│   ├── venv
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
    ├── tsconfig.json
