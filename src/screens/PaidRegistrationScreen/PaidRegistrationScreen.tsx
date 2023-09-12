import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {PaidRegistrationScreenProps} from './PaidRegistrationScreen.types';
import {Header, RegistryInfo, SearchBar} from '../../components';
import {RegistryApi} from '../../services';
import dayjs from 'dayjs';
import {IRegistrationDetail} from '../../types';
import {styles} from './PaidRegistrationScreen.styled';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const PaidRegistrationScreen: FC<PaidRegistrationScreenProps> = ({}) => {
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState<IRegistrationDetail[]>([]);
  const [filteredDataSource, setFilteredDataSource] = useState<
    IRegistrationDetail[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const hideCalendar = useCallback(() => {
    setVisible(false);
  }, []);

  const showCalendar = useCallback(() => {
    setVisible(true);
  }, []);

  const handleGetData = useCallback(async (date: Date) => {
    try {
      setIsLoading(true);
      setData([]);
      setFilteredDataSource([]);
      const res = await RegistryApi.getRegistriesByType(
        1,
        dayjs(date).format('YYYY-MM-DD'),
      );
      if (res.status === 1) {
        setData(res.data.registries);
        setFilteredDataSource(res.data.registries);
      }
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetData(date);
  }, []);

  const handleSelectDate = useCallback((day: Date) => {
    setDate(day);
    setVisible(false);
    handleGetData(day);
  }, []);

  const searchFilterFunction = useCallback(
    (text: string) => {
      // Check if searched text is not blank
      if (text != '') {
        const newData = data.filter(function (item) {
          const itemName = item.owner_name
            ? item.owner_name.toUpperCase()
            : ''.toUpperCase();
          const itemData = item.license_plate
            ? item.license_plate.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return (
            itemData.indexOf(textData) > -1 || itemName.indexOf(textData) > -1
          );
        });
        setFilteredDataSource(newData);
      } else {
        setFilteredDataSource(data);
      }
    },
    [data],
  );

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <Header title="DS đăng kiểm đã thu tiền" />
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={showCalendar} style={styles.calender}>
          <Image
            source={require('../../assets/icons/calendar_icon.png')}
            style={{
              width: 14,
              height: 14,
            }}
          />
          <Text style={styles.calender_title}>
            {dayjs(date).format('DD/MM/YYYY')}
          </Text>
        </TouchableOpacity>
        <SearchBar onChangeText={searchFilterFunction} />
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => {
                handleGetData(date);
              }}
            />
          }>
          {!isLoading && filteredDataSource.length === 0 && (
            <Text style={styles.dataNull}>Không có dữ liệu</Text>
          )}
          {filteredDataSource.map(registry => (
            <RegistryInfo data={registry} type={1} key={registry.id} />
          ))}
        </ScrollView>
      </View>
      <DateTimePickerModal
        isVisible={visible}
        mode="date"
        onConfirm={handleSelectDate}
        onCancel={hideCalendar}
        date={date}
      />
    </View>
  );
};

export default PaidRegistrationScreen;
