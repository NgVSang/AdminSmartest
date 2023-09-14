import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {RouteProp} from '@react-navigation/native';

export interface RegisteredRegistrationDetailScreenProps {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'RegisteredRegistrationDetail'
  >;
  route: RouteProp<RootStackParamList, 'RegisteredRegistrationDetail'>;
}
