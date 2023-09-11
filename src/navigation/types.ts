import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Bottom: NavigatorScreenParams<BottomNavigate> | undefined;
  Profile: undefined;
  UpdateProfile: undefined;
  MonitoringSchedule: undefined;
  MonitorRegistrationDetail: {
    id: number;
  };
};

export type BottomNavigate = {
  HomeTab: undefined;
  NotificationTab: undefined;
};
