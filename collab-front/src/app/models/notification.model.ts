export interface NotificationDTO {
  id?: number ,
  message: string,
  createdAt? : string ,
  isRead?: boolean ,
  type : string ,
  taskId?: number,
  boardId?: number,
  ownerNotification : number
  }
