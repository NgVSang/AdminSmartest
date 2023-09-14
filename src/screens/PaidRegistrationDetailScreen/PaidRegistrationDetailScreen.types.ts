import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {RouteProp} from '@react-navigation/native';

export interface PaidRegistrationDetailScreenProps {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'PaidRegistrationDetail'
  >;
  route: RouteProp<RootStackParamList, 'PaidRegistrationDetail'>;
}
