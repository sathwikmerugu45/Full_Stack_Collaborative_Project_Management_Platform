import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TASKS, GET_PROJECT } from '../../graphql/queries';
import { CREATE_TASK, UPDATE_TASK } from '../../graphql/mutations';
import { useSocket } from '../../context/SocketContext';
import { Plus, Calendar, User, AlertCircle } from 'lucide-react';

interface TaskBoardProps {
  projectId: string;
  onTaskUpdate: () => void;
}

const TaskColumn: React.FC<{
  title: string;
  status: string;
  tasks: any[];
  onTaskUpdate: (taskId: string, updates: any) => void;
  color: string;
}> = ({ title, status, tasks, onTaskUpdate, color }) => {
  const priorityColors = {
    low: 'border-green-200 bg-green-50 text-green-800',
    medium: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    high: 'border-red-200 bg-red-50 text-red-800',
    urgent: 'border-red-500 bg-red-100 text-red-900',
  };

  return (
    <div className="flex-1 bg-gray-50 rounded-lg p-4">
      <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${color}`}>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              // Handle task click - could open edit modal
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
              <span className={`text-xs px-2 py-1 rounded-full border ${
                priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium
              }`}>
                {task.priority}
              </span>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                {task.assignee && (
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{task.assignee.name}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(task.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex space-x-1">
                {status !== 'todo' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskUpdate(task.id, { status: 'todo' });
                    }}
                    className="text-gray-400 hover:text-blue-600 p-1"
                    title="Move to Todo"
                  >
                    ←
                  </button>
                )}
                {status !== 'completed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextStatus = status === 'todo' ? 'in_progress' : 'completed';
                      onTaskUpdate(task.id, { status: nextStatus });
                    }}
                    className="text-gray-400 hover:text-green-600 p-1"
                    title={`Move to ${status === 'todo' ? 'In Progress' : 'Completed'}`}
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TaskBoard: React.FC<TaskBoardProps> = ({ projectId, onTaskUpdate }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  const { sendTaskUpdate } = useSocket();

  const { data, loading, error, refetch } = useQuery(GET_TASKS, {
    variables: { projectId },
    errorPolicy: 'all'
  });

  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      refetch();
      onTaskUpdate();
    }
  });

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: (data) => {
      refetch();
      onTaskUpdate();
      sendTaskUpdate(projectId, data.updateTask);
    }
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({
        variables: {
          input: {
            ...newTask,
            project_id: projectId
          }
        }
      });
      setNewTask({ title: '', description: '', priority: 'medium' });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: any) => {
    try {
      await updateTask({
        variables: {
          id: taskId,
          input: updates
        }
      });
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">Failed to load tasks</p>
        <button
          onClick={() => refetch()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const tasks = data?.tasks || [];
  const todoTasks = tasks.filter((task: any) => task.status === 'todo');
  const inProgressTasks = tasks.filter((task: any) => task.status === 'in_progress');
  const completedTasks = tasks.filter((task: any) => task.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Task Board</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Describe the task"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task Columns */}
      <div className="flex space-x-6 overflow-x-auto">
        <TaskColumn
          title="To Do"
          status="todo"
          tasks={todoTasks}
          onTaskUpdate={handleTaskUpdate}
          color="border-gray-300"
        />
        <TaskColumn
          title="In Progress"
          status="in_progress"
          tasks={inProgressTasks}
          onTaskUpdate={handleTaskUpdate}
          color="border-blue-300"
        />
        <TaskColumn
          title="Completed"
          status="completed"
          tasks={completedTasks}
          onTaskUpdate={handleTaskUpdate}
          color="border-green-300"
        />
      </div>
    </div>
  );
};