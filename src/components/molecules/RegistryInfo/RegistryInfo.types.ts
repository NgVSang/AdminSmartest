import {TouchableOpacityProps} from 'react-native';
import {IRegistrationDetail} from '../../../types';

export interface RegistryInfoProps extends TouchableOpacityProps {
  data: IRegistrationDetail;
  type: 0 | 1 | 2;
  onConfirm?: (data: IRegistrationDetail) => void;
  onCancle?: (data: IRegistrationDetail) => void;
}
