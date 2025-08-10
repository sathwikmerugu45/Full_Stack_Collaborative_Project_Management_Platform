import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { createGraphQLContext } from './middleware/auth.js';
import { initializeDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initializeDatabase();

// Create Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await apolloServer.start();

// GraphQL endpoint
app.use('/graphql', expressMiddleware(apolloServer, {
  context: createGraphQLContext,
}));

// REST API routes
app.use('/api/auth', authRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join project room
  socket.on('join-project', (projectId) => {
    socket.join(`project-${projectId}`);
    console.log(`User ${socket.id} joined project ${projectId}`);
  });

  // Leave project room
  socket.on('leave-project', (projectId) => {
    socket.leave(`project-${projectId}`);
    console.log(`User ${socket.id} left project ${projectId}`);
  });

  // Handle chat messages
  socket.on('send-message', (data) => {
    const { projectId, message } = data;
    // Broadcast to all users in the project room
    io.to(`project-${projectId}`).emit('new-message', message);
  });

  // Handle task updates
  socket.on('task-updated', (data) => {
    const { projectId, task } = data;
    // Broadcast task update to project members
    io.to(`project-${projectId}`).emit('task-update', task);
  });

  // Handle project updates
  socket.on('project-updated', (data) => {
    const { projectId, project } = data;
    // Broadcast project update to all members
    io.to(`project-${projectId}`).emit('project-update', project);
  });

  // Handle user typing in chat
  socket.on('typing', (data) => {
    const { projectId, user, isTyping } = data;
    socket.to(`project-${projectId}`).emit('user-typing', { user, isTyping });
  });

  // Handle online status
  socket.on('user-online', (userId) => {
    socket.broadcast.emit('user-status-change', { userId, online: true });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
});