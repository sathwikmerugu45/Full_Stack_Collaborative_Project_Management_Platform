import { gql } from '@apollo/client';

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      title
      description
      status
      owner {
        id
        name
        email
      }
      created_at
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      title
      description
      status
      updated_at
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
      project {
        id
        title
      }
      assignee {
        id
        name
        email
      }
      creator {
        id
        name
      }
      created_at
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      status
      priority
      assignee {
        id
        name
        email
      }
      updated_at
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($projectId: ID!, $content: String!) {
    sendMessage(projectId: $projectId, content: $content) {
      id
      content
      user {
        id
        name
        avatar
      }
      project {
        id
        title
      }
      created_at
    }
  }
`;