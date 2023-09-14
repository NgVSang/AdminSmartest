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
  RegisteredRegistrationDetail: {
    id: number;
  };
  PaidRegistration: {
    date?: Date;
  };
  PaidRegistrationDetail: {
    id: number;
  };
  CompletedRegistration: {
    date?: Date;
  };
  CompletedRegistrationDetail: {
    id: number;
    status?: number;
  };
};

export type BottomNavigate = {
  HomeTab: undefined;
  NotificationTab: undefined;
};
