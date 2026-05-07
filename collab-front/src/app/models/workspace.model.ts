export interface WorkspaceDTO {
  id: number;
  name: string;
  description?: string;
  slug?: string;
  ownerId?: number;
  myRole?: string;
}

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface WorkspaceMemberDTO {
  userId: number;
  name: string;
  email: string;
  avatarUrl?: string;
  role: WorkspaceRole;
}
