# Full-Stack Collaborative Project Management Platform

A comprehensive full-stack application built with React, Node.js, GraphQL, WebSockets, and Supabase that demonstrates modern web development practices including authentication, real-time communication, and efficient data fetching.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**: Role-based access control (Admin, Member, Viewer)
- **Real-time Communication**: WebSocket-powered chat and live notifications
- **GraphQL API**: Efficient data fetching with queries, mutations, and subscriptions
- **Project Management**: Create, manage, and collaborate on projects
- **Task Management**: Kanban-style task board with drag-and-drop functionality
- **Live Collaboration**: Real-time updates across all connected clients

### Technical Features
- **MERN Stack**: MongoDB (Supabase), Express.js, React, Node.js
- **GraphQL**: Apollo Server and Client for efficient data management
- **WebSockets**: Socket.io for real-time bidirectional communication
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **TypeScript**: Full type safety across frontend and backend
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Apollo Client** for GraphQL state management
- **Socket.io Client** for real-time features
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **Apollo Server** for GraphQL
- **Socket.io** for WebSocket connections
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Supabase** for database

## 📋 Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Supabase account** (for database)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fullstack-collab-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your Supabase credentials:
   ```env
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Set up the database**
   
   Click the "Connect to Supabase" button in the top right of the interface to set up your database schema.

5. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start both the frontend (http://localhost:5173) and backend (http://localhost:3001) servers.

## 📊 Database Schema

The application uses the following main tables:

- **users**: User accounts with roles and authentication
- **projects**: Project information and metadata
- **project_members**: Many-to-many relationship between users and projects
- **tasks**: Task management with status and priority
- **chat_messages**: Real-time chat messages for projects

## 🔐 Authentication & Authorization

- **JWT-based authentication** with secure token storage
- **Role-based access control** (Admin, Member, Viewer)
- **Password hashing** with bcrypt
- **Protected routes** and API endpoints
- **Row Level Security** implemented at the database level

## 🌐 API Endpoints

### REST API
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### GraphQL API
- **Queries**: Users, projects, tasks, chat messages
- **Mutations**: CRUD operations for all entities
- **Subscriptions**: Real-time updates for chat and tasks

### WebSocket Events
- `join-project` / `leave-project` - Room management
- `send-message` - Chat messages
- `task-updated` - Task changes
- `typing` - Typing indicators

## 🎨 UI/UX Features

- **Modern, clean interface** with professional aesthetics
- **Real-time indicators** and smooth animations
- **Responsive design** optimized for all devices
- **Loading states** and error handling
- **Intuitive navigation** with role-based UI differences
- **Accessible components** with proper ARIA labels

## 📱 Real-time Features

- **Live chat** with typing indicators
- **Real-time task updates** across all clients
- **Online user status** indicators
- **Instant notifications** for project changes
- **Live collaboration** on projects and tasks

## 🔒 Security Features

- **JWT token authentication**
- **Password hashing** with bcrypt
- **Row Level Security** (RLS) in Supabase
- **Input validation** and sanitization
- **CORS protection**
- **Environment variable protection**

## 🚀 Deployment

The application is ready for production deployment:

### Frontend (Netlify/Vercel)
1. Build the client: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables for production

### Backend (Railway/Heroku)
1. Deploy the `server` folder
2. Set production environment variables
3. Configure database connection

## 📈 Performance Optimizations

- **GraphQL efficient queries** with Apollo Client caching
- **WebSocket connection pooling**
- **Database query optimization** with proper indexing
- **Code splitting** and lazy loading
- **Image optimization** and asset compression
- **Caching strategies** for improved performance

## 🧪 Testing

The application includes comprehensive testing setup:

- **Unit tests** for components and utilities
- **Integration tests** for API endpoints
- **WebSocket testing** for real-time features
- **GraphQL query testing**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.