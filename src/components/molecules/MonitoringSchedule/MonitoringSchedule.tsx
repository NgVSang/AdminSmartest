import {Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {MonitoringScheduleProps} from './MonitoringSchedule.types';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {styles} from './MonitoringSchedule.styled';
import {colors} from '../../../constants';
import {RegistryApi} from '../../../services/api';
import {DateData, MarkedDates} from 'react-native-calendars/src/types';

LocaleConfig.locales['vn'] = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  dayNames: [
    'Chủ nhật',
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy',
  ],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};
LocaleConfig.defaultLocale = 'vn';

type DateMarker = {
  date: string;
};

const MonitoringSchedule: FC<MonitoringScheduleProps> = ({
  containerStyle,
  onPressDate,
  dateSelected,
}) => {
  const [dateMarker, setDateMarker] = useState<DateMarker[]>();

  const getListDateRegistry = async () => {
    try {
      const res = await RegistryApi.getListDate();
      //@ts-ignore
      if (res.status === 0) throw new Error(res.message);
      setDateMarker(res.data.rows);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getListDateRegistry();
  }, []);

  const markedDates = useMemo(() => {
    let dates: MarkedDates = {};
    let check = true;
    if (dateMarker) {
      for (let i = 0; i < dateMarker.length; i++) {
        const date = dateMarker[i];

        let obj: any;
        if (dateSelected === date.date) {
          obj = {
            [date.date]: {marked: true, selected: true},
          };
          check = false;
        } else {
          obj = {
            [date.date]: {marked: true},
          };
        }

        dates = Object.assign({}, obj, dates);
      }
    }
    if (dateSelected && check) {
      dates = {...dates, ...{[dateSelected]: {selected: true}}};
    }
    return dates;
  }, [dateMarker, dateSelected]);

  const handlePressDay = useCallback(
    (day: DateData) => {
      if (onPressDate) {
        onPressDate(day);
      }
    },
    [onPressDate],
  );

  return (
    <View style={[styles.group, containerStyle]}>
      <Calendar
        scrollEnabled
        onDayPress={handlePressDay}
        enableSwipeMonths
        firstDay={1}
        showScrollIndicator={true}
        markedDates={markedDates}
        renderHeader={date => {
          return (
            <TouchableOpacity onPress={() => console.log('calender')}>
              <Text style={styles.calender_title_style}>
                Tháng {date.getMonth() + 1}/{date.getFullYear()}
              </Text>
            </TouchableOpacity>
          );
        }}
        style={styles.calender_style}
        theme={{
          dotColor: colors.RED,
          selectedDayBackgroundColor: colors.GREEN,
          selectedDayTextColor: colors.WHITE,
          selectedDotColor: colors.WHITE,
        }}
      />
    </View>
  );
};

export default MonitoringSchedule;
