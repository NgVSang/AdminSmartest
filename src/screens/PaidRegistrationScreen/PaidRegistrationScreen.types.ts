import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {RouteProp} from '@react-navigation/native';

export interface PaidRegistrationScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PaidRegistration'>;
  route: RouteProp<RootStackParamList, 'PaidRegistration'>;
}
