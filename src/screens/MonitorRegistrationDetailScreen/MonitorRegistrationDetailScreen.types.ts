import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {RouteProp} from '@react-navigation/native';

export interface MonitorRegistrationDetailScreenProps {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'MonitorRegistrationDetail'
  >;
  route: RouteProp<RootStackParamList, 'MonitorRegistrationDetail'>;
}
