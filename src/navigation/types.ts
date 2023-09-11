import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Bottom: NavigatorScreenParams<BottomNavigate> | undefined;
  Profile: undefined;
  UpdateProfile: undefined;
};

export type BottomNavigate = {
  HomeTab: undefined;
  NotificationTab: undefined;
};
