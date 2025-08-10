export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
    avatar: String
    created_at: String!
  }

  type Project {
    id: ID!
    title: String!
    description: String
    status: String!
    owner_id: String!
    owner: User!
    members: [User!]!
    tasks: [Task!]!
    created_at: String!
    updated_at: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: String!
    priority: String!
    project_id: String!
    project: Project!
    assignee_id: String
    assignee: User
    created_by: String!
    creator: User!
    created_at: String!
    updated_at: String!
  }

  type ChatMessage {
    id: ID!
    content: String!
    user_id: String!
    user: User!
    project_id: String!
    project: Project!
    created_at: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input CreateProjectInput {
    title: String!
    description: String
  }

  input UpdateProjectInput {
    title: String
    description: String
    status: String
  }

  input CreateTaskInput {
    title: String!
    description: String
    priority: String!
    project_id: String!
    assignee_id: String
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: String
    priority: String
    assignee_id: String
  }

  type Query {
    me: User
    projects: [Project!]!
    project(id: ID!): Project
    tasks(projectId: ID): [Task!]!
    task(id: ID!): Task
    chatMessages(projectId: ID!): [ChatMessage!]!
  }

  type Mutation {
    register(email: String!, password: String!, name: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
    addProjectMember(projectId: ID!, userId: ID!): Boolean!
    removeProjectMember(projectId: ID!, userId: ID!): Boolean!
    
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
    
    sendMessage(projectId: ID!, content: String!): ChatMessage!
  }

  type Subscription {
    messageAdded(projectId: ID!): ChatMessage!
    taskUpdated(projectId: ID!): Task!
    projectUpdated: Project!
  }
`;