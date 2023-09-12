import {IRegistrationDetail} from '../../../types';

export interface RegistryInfoProps {
  data: IRegistrationDetail;
  type: 0 | 1 | 2;
  onConfirm?: () => void;
  conCancel?: () => void;
}
