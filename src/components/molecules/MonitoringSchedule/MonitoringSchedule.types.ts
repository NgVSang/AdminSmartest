import {ViewStyle} from 'react-native';
import {DateData} from 'react-native-calendars';

export interface MonitoringScheduleProps {
  containerStyle?: ViewStyle;
  onPressDate?: (date: DateData) => void;
  dateSelected?: string;
}
