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
  RegisteredRegistration: undefined;
  PaidRegistration: {
    date?: Date;
  };
  CompletedRegistration: {
    date?: Date;
  };
};

export type BottomNavigate = {
  HomeTab: undefined;
  NotificationTab: undefined;
};
