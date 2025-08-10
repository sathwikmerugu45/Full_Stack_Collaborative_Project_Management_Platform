import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

export const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return user;
    },

    projects: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: projects, error } = await supabase
        .from('projects')
        .select(`
          *,
          owner:users!owner_id(*),
          members:project_members(user:users(*)),
          tasks(*)
        `)
        .or(`owner_id.eq.${user.id},project_members.user_id.eq.${user.id}`);

      if (error) throw new Error(error.message);
      return projects;
    },

    project: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: project, error } = await supabase
        .from('projects')
        .select(`
          *,
          owner:users!owner_id(*),
          members:project_members(user:users(*)),
          tasks(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      return project;
    },

    tasks: async (_, { projectId }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*),
          assignee:users!assignee_id(*),
          creator:users!created_by(*)
        `);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data: tasks, error } = await query;
      if (error) throw new Error(error.message);
      return tasks;
    },

    task: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: task, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*),
          assignee:users!assignee_id(*),
          creator:users!created_by(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      return task;
    },

    chatMessages: async (_, { projectId }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          user:users(*),
          project:projects(*)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw new Error(error.message);
      return messages;
    },
  },

  Mutation: {
    register: async (_, { email, password, name }) => {
      const hashedPassword = await bcrypt.hash(password, 12);

      const { data: user, error } = await supabase
        .from('users')
        .insert({
          email,
          password_hash: hashedPassword,
          name,
          role: 'member'
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return { token, user };
    },

    login: async (_, { email, password }) => {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) throw new Error('Invalid credentials');

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) throw new Error('Invalid credentials');

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return { token, user };
    },

    createProject: async (_, { input }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          ...input,
          owner_id: user.id,
          status: 'active'
        })
        .select(`
          *,
          owner:users!owner_id(*),
          members:project_members(user:users(*)),
          tasks(*)
        `)
        .single();

      if (error) throw new Error(error.message);
      return project;
    },

    updateProject: async (_, { id, input }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: project, error } = await supabase
        .from('projects')
        .update(input)
        .eq('id', id)
        .eq('owner_id', user.id)
        .select(`
          *,
          owner:users!owner_id(*),
          members:project_members(user:users(*)),
          tasks(*)
        `)
        .single();

      if (error) throw new Error(error.message);
      return project;
    },

    deleteProject: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('owner_id', user.id);

      if (error) throw new Error(error.message);
      return true;
    },

    createTask: async (_, { input }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          ...input,
          created_by: user.id,
          status: 'todo'
        })
        .select(`
          *,
          project:projects(*),
          assignee:users!assignee_id(*),
          creator:users!created_by(*)
        `)
        .single();

      if (error) throw new Error(error.message);
      return task;
    },

    updateTask: async (_, { id, input }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: task, error } = await supabase
        .from('tasks')
        .update(input)
        .eq('id', id)
        .select(`
          *,
          project:projects(*),
          assignee:users!assignee_id(*),
          creator:users!created_by(*)
        `)
        .single();

      if (error) throw new Error(error.message);
      return task;
    },

    deleteTask: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return true;
    },

    sendMessage: async (_, { projectId, content }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: message, error } = await supabase
        .from('chat_messages')
        .insert({
          content,
          user_id: user.id,
          project_id: projectId
        })
        .select(`
          *,
          user:users(*),
          project:projects(*)
        `)
        .single();

      if (error) throw new Error(error.message);
      return message;
    },
  },
};