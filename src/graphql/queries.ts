import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
      description
      status
      owner_id
      owner {
        id
        name
        email
      }
      members {
        user {
          id
          name
          email
          avatar
        }
      }
      tasks {
        id
        title
        status
        priority
      }
      created_at
      updated_at
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      title
      description
      status
      owner_id
      owner {
        id
        name
        email
      }
      members {
        user {
          id
          name
          email
          avatar
        }
      }
      tasks {
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
        creator {
          id
          name
        }
        created_at
        updated_at
      }
      created_at
      updated_at
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks($projectId: ID) {
    tasks(projectId: $projectId) {
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
      updated_at
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($projectId: ID!) {
    chatMessages(projectId: $projectId) {
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

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      role
      avatar
      created_at
    }
  }
`;