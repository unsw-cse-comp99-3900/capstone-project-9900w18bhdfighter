type JsonString = string
interface NotificationRspDTO {
  NotificationID: number
  Type: 'personal' | 'group' | 'project'
  Message: string
  AdditionalData: JsonString | null
  CreatedAt: string
  FromGroup: number | null
  FromUser: number | null
  IsRead: boolean
}

interface NotificationReqDTO {
  Type: 'personal' | 'group' | 'project'
  Message: string
  AdditionalData?: {
    ObjectID: number
  } | null
  FromGroup: number | null
  FromUser: number | null
  Receivers: number[]
}
interface NotificationStatus {
  IsRead: boolean
}

interface Notification {
  notificationId: number
  type: 'personal' | 'group' | 'project'
  message: string
  additionalData: {
    objectId: number
  } | null
  createdAt: string
  fromGroup: number | null
  fromUser: number | null
  isRead: boolean
}
export {
  NotificationRspDTO,
  NotificationReqDTO,
  NotificationStatus,
  Notification,
}
