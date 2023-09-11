import {INotice} from '../../types';
import instance from '../api/axios';

const ENDPOINTS = {
  LISTNOTIFICATION: '/employee/notification/list',
  NOTIFICATIONDETAIL: '/employee/notification',
  GETNOTIFICATION: '/employee/notifications/check',
};

const getListNotification = (limit?: number, page?: number) => {
  return instance.get<{rows: INotice[]; recordsTotal: number}>(
    ENDPOINTS.LISTNOTIFICATION,
    {
      params: {
        limit: limit || 10,
        page: page || 1,
      },
    },
  );
};

const getNotificationsById = (id: number) => {
  return instance.get(ENDPOINTS.NOTIFICATIONDETAIL, {
    params: {
      id: id,
    },
  });
};

const getNotificationStatus = () => {
  return instance.get(ENDPOINTS.GETNOTIFICATION);
};

const updateNotificationStatus = () => {
  return instance.put(ENDPOINTS.GETNOTIFICATION);
};

export const NotificationApi = {
  getListNotification,
  getNotificationsById,
  getNotificationStatus,
  updateNotificationStatus,
};
