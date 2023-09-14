import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {RouteProp} from '@react-navigation/native';

export interface CompletedRegistrationScreenProps {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'CompletedRegistration'
  >;
  route: RouteProp<RootStackParamList, 'CompletedRegistration'>;
}
