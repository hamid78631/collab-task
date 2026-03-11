export interface Member {
  initials: string;
}

export interface BoardDTO {
  id: number;
  name: string;
  description?: string;
  isFavorite: boolean;
  workspaceId: number;
  progress?: number;
  tags?: string[];
  members?: Member[];
}
