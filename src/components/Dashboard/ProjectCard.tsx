import React from 'react';
import { Calendar, Users, CheckSquare, MoreVertical } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  members: Array<{
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
  }>;
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
  }>;
  created_at: string;
  updated_at: string;
}

interface ProjectCardProps {
  project: Project;
  onProjectClick: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onProjectClick }) => {
  const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
      onClick={() => onProjectClick(project.id)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
            {project.description && (
              <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
            )}
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status as keyof typeof statusColors] || statusColors.active}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(project.updated_at).toLocaleDateString()}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <CheckSquare className="h-4 w-4 mr-1" />
            {completedTasks}/{totalTasks} tasks
          </div>
          
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {project.members.slice(0, 3).map((member, index) => (
                <div 
                  key={member.user.id}
                  className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs border-2 border-white"
                  title={member.user.name}
                >
                  {member.user.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {project.members.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-xs border-2 border-white">
                  +{project.members.length - 3}
                </div>
              )}
            </div>
            <div className="ml-2 flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              {project.members.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};