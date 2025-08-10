import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECT } from '../../graphql/queries';
import { useSocket } from '../../context/SocketContext';
import { TaskBoard } from './TaskBoard';
import { ChatPanel } from './ChatPanel';
import { ArrowLeft, Users, Calendar, MessageCircle, CheckSquare } from 'lucide-react';

interface ProjectViewProps {
  projectId: string;
  onBack: () => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ projectId, onBack }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'chat'>('tasks');
  const { joinProject, leaveProject } = useSocket();

  const { data, loading, error, refetch } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
    errorPolicy: 'all'
  });

  useEffect(() => {
    if (projectId) {
      joinProject(projectId);
      return () => leaveProject(projectId);
    }
  }, [projectId, joinProject, leaveProject]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data?.project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load project</p>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const project = data.project;
  const completedTasks = project.tasks?.filter((task: any) => task.status === 'completed').length || 0;
  const totalTasks = project.tasks?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {project.members?.slice(0, 5).map((member: any) => (
                  <div 
                    key={member.user.id}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-white"
                    title={member.user.name}
                  >
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {project.members?.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm border-2 border-white">
                    +{project.members.length - 5}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              {project.description && (
                <p className="text-gray-600 mb-4">{project.description}</p>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{project.members?.length || 0} members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4" />
                  <span>{completedTasks}/{totalTasks} tasks completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 lg:mt-0 lg:ml-6">
              <div className="w-full lg:w-48">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors`}
            >
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-4 w-4" />
                <span>Tasks</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors`}
            >
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Chat</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'tasks' && (
          <TaskBoard projectId={projectId} onTaskUpdate={() => refetch()} />
        )}
        {activeTab === 'chat' && (
          <ChatPanel projectId={projectId} />
        )}
      </div>
    </div>
  );
};