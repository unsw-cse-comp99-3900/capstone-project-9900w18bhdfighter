import {
  NotificationReqDTO,
  NotificationRspDTO,
  NotificationStatus,
} from '../types/notification'
import api from './config'

const getMyNotifications = async () => {
  return api.get<NotificationRspDTO[]>('api/notifications/')
}

const createNotification = async (notification: NotificationReqDTO) => {
  return api.post('api/notifications/', notification)
}

const changeNotificationStatus = async (
  notificationId: number | string,
  status: NotificationStatus
) => {
  return api.put(`api/notifications/${notificationId}/status`, status)
}

//mapper
const mapNotificationDTOToNotification = (
  notificationDTO: NotificationRspDTO
) => {
  return {
    notificationId: notificationDTO.NotificationID,
    type: notificationDTO.Type,
    message: notificationDTO.Message,
    additionalData: notificationDTO.AdditionalData
      ? {
          objectId: JSON.parse(notificationDTO.AdditionalData).ObjectID,
        }
      : null,
    createdAt: notificationDTO.CreatedAt,
    fromGroup: notificationDTO.FromGroup,
    fromUser: notificationDTO.FromUser,
    isRead: notificationDTO.IsRead,
  }
}

export {
  getMyNotifications,
  createNotification,
  changeNotificationStatus,
  mapNotificationDTOToNotification,
}
