# flow.
> A minimalist, high-performance task management ecosystem.

**flow.** is a full-stack project management application designed with a focus on simplicity, speed, and a distraction-free user experience. It features a custom minimalist dark UI and a robust, scalable backend architecture.

---

## 🏗️ Architecture

The application follows a modern, decoupled client-server architecture, utilizing a RESTful API for communication between the React frontend and the Node.js backend.

```mermaid
graph TD
    Client[Client Browser]
    
    subgraph Frontend ["Frontend (Vite + React + TS)"]
        UI[UI Components & Views]
        State[React Query / Hooks]
    end
    
    subgraph Backend ["Backend (Node.js + Express + TS)"]
        API[API Routes]
        Auth[Auth Middleware]
        Controllers[Controllers & Logic]
        Prisma[Prisma ORM]
    end
    
    DB[(PostgreSQL Database)]

    Client -->|Interacts| UI
    UI <--> State
    State -->|HTTP / REST API| API
    API --> Auth
    Auth --> Controllers
    Controllers <--> Prisma
    Prisma <-->|TCP / Connection Pool| DB
    
    style Client fill:#161616,stroke:#3a3a3a,color:#fff
    style Frontend fill:#161616,stroke:#10b981,color:#fff
    style Backend fill:#161616,stroke:#10b981,color:#fff
    style DB fill:#1a2e27,stroke:#10b981,color:#fff
```

### 🗄️ Database Schema

The relational database is carefully designed to support multi-user projects, role-based access control, and comprehensive task tracking.

```mermaid
erDiagram
    USER ||--o{ PROJECT : "owns"
    USER ||--o{ PROJECT_MEMBER : "is member of"
    PROJECT ||--o{ PROJECT_MEMBER : "has"
    PROJECT ||--o{ TASK : "contains"
    USER ||--o{ TASK : "assigned to"
    USER ||--o{ TASK : "creates"

    USER {
        uuid id PK
        string name
        string email
        string password_hash
        datetime created_at
    }

    PROJECT {
        uuid id PK
        string name
        string description
        uuid owner_id FK
        datetime created_at
        datetime updated_at
    }

    PROJECT_MEMBER {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        enum role "ADMIN | MEMBER"
        datetime joined_at
    }

    TASK {
        uuid id PK
        string title
        string description
        enum status "PENDING | IN_PROGRESS | COMPLETED"
        enum priority "LOW | MEDIUM | HIGH"
        uuid project_id FK
        uuid assignee_id FK
        uuid created_by FK
        datetime due_date
        datetime created_at
        datetime updated_at
    }
```

---

## 🛠️ Technology Stack

**Frontend**
*   **Core:** React 19, TypeScript, Vite
*   **Routing & State:** React Router, TanStack Query (React Query) for efficient server state management.
*   **Styling:** TailwindCSS v4 with a custom, highly optimized minimalist dark theme (`#0f0f0f` base).

**Backend**
*   **Core:** Node.js, Express, TypeScript
*   **Database & ORM:** PostgreSQL, Prisma ORM
*   **Authentication:** JWT (JSON Web Tokens), bcryptjs for secure password hashing.
*   **Validation:** Zod for rigorous runtime type safety and schema validation.

---

## ✨ Key Features

*   **Distraction-Free UI:** Custom built UI components favoring stark contrasts, monochromatic scales, and subtle emerald accents (`#10b981`) over heavy gradients or shadows.
*   **Kanban Task Boards:** Drag-and-drop friendly task organization by status.
*   **Role-Based Access Control (RBAC):** Differentiated permissions for Project Admins vs. Members.
*   **Real-time optimistic UI updates:** Leveraging React Query for zero-latency interactions.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL running locally or via Docker

### 1. Clone & Install
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup
Create a `.env` file in the `backend` directory based on `.env.example`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
PORT=3000
JWT_SECRET="your_secure_jwt_secret"
FRONTEND_URL="http://localhost:5173"
```

### 3. Database Migration
```bash
cd backend
npx prisma migrate dev
```

### 4. Run the application
Run these commands in two separate terminal instances:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` to view the application.
