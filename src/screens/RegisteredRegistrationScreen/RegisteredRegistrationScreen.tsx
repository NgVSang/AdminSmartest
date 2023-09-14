import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {RegisteredRegistrationScreenProps} from './RegisteredRegistrationScreen.types';
import {Header, Loading, RegistryInfo, SearchBar} from '../../components';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {styles} from './RegisteredRegistrationScreen.styled';
import dayjs from 'dayjs';
import {RegistryApi} from '../../services';
import {IFormData, IRegistrationDetail} from '../../types';
import {useDispatch} from 'react-redux';
import {closeModal, openModal} from '../../redux';
import {fonts} from '../../constants';
import {
  converLicensePlate,
  convertNonPrice,
  formatDate,
} from '../../utils/string';
import {useFormik} from 'formik';
import {TextInputMask} from 'react-native-masked-text';
import Toast from 'react-native-toast-message';

const RegisteredRegistrationScreen: FC<RegisteredRegistrationScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState<IRegistrationDetail[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
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
        0,
        dayjs(date).format('YYYY-MM-DD'),
      );
      if (res.status === 1) {
        setData(res.data.registries);
        setFilteredDataSource(res.data.registries);
      }
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

  const handleSubmit = useCallback(async (data: IFormData) => {
    console.log(data);
    try {
      setLoadingSubmit(true);
      const dataSend = {
        id: data.id,
        fee_5: convertNonPrice(data.fee_5),
        fee_6: convertNonPrice(data.fee_6),
        fee_7: convertNonPrice(data.fee_7),
      };
      const res = await RegistryApi.handlePayment(dataSend);
      if (res.status === 1) {
        navigation.reset({
          index: 1,
          routes: [
            {name: 'Bottom'},
            {
              name: 'PaidRegistration',
              params: {
                date: date,
              },
            },
          ],
        });
      } else {
        //@ts-ignore
        throw new Error(res.message);
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Xác nhận thu phí thất bại',
        text2: error.message || 'Vui lòng thử lại.',
      });
    } finally {
      setLoadingSubmit(false);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      id: '0',
      fee_5: '0',
      fee_6: '0',
      fee_7: '0',
    },
    onSubmit: handleSubmit,
  });

  const handleInputFee = useCallback(
    (data: IRegistrationDetail) => {
      dispatch(
        openModal({
          content: (
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 6,
              }}>
              <Text style={styles.modal_title}>Thu phí </Text>
              <View style={styles.modal_select}>
                <Text style={styles.modal_select_title}>Phí đăng kiểm</Text>
                <TextInputMask
                  type="money"
                  options={{
                    precision: 0,
                    separator: '.',
                    delimiter: '.',
                    unit: '',
                  }}
                  keyboardType="numeric"
                  onChangeText={text => {
                    formik.setFieldValue('fee_5', text);
                  }}
                  style={styles.modal_select_input}
                />
              </View>
              <View style={styles.modal_select}>
                <Text style={styles.modal_select_title}>Lệ phí đăng kiểm</Text>
                <TextInputMask
                  type="money"
                  options={{
                    precision: 0,
                    separator: '.',
                    delimiter: '.',
                    unit: '',
                  }}
                  keyboardType="numeric"
                  onChangeText={text => {
                    formik.setFieldValue('fee_6', text);
                  }}
                  style={styles.modal_select_input}
                />
              </View>
              <View style={styles.modal_select}>
                <Text style={styles.modal_select_title}>Phí khác</Text>
                <TextInputMask
                  type="money"
                  options={{
                    precision: 0,
                    separator: '.',
                    delimiter: '.',
                    unit: '',
                  }}
                  keyboardType="numeric"
                  onChangeText={text => {
                    formik.setFieldValue('fee_7', text);
                  }}
                  style={styles.modal_select_input}
                />
              </View>
            </View>
          ),
          handleConfirm: () => {
            formik.handleSubmit();
          },
        }),
      );
    },
    [dispatch, formik],
  );

  const handleConfirm = useCallback(
    (data: IRegistrationDetail) => {
      dispatch(
        openModal({
          content: (
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 6,
                padding: 22,
              }}>
              <Text style={styles.modal_text}>
                Bạn có chắc muốn xác nhận thanh toán phí và lệ phí đăng kiểm cho
                xe có biển kiểm soát
                <Text style={{fontFamily: fonts.BE_VIETNAM_PRO_BOLD}}>
                  {' '}
                  {converLicensePlate(data.license_plate)}
                </Text>{' '}
                đăng kiểm ngày{' '}
                <Text style={{fontFamily: fonts.BE_VIETNAM_PRO_BOLD}}>
                  {dayjs(data.date).format('DD/MM/YYYY, hh:mm')}
                </Text>{' '}
                không?
              </Text>
            </View>
          ),
          handleConfirm: async () => {
            await dispatch(closeModal());
            formik.setFieldValue('id', data.id.toString());
            handleInputFee(data);
          },
        }),
      );
    },
    [dispatch, handleInputFee],
  );

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <Header title="DS đã đăng ký đăng kiểm" />
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
            <RegistryInfo
              data={registry}
              onPress={() => {
                navigation.push('RegisteredRegistrationDetail', {
                  id: registry.id,
                });
              }}
              type={0}
              key={registry.id}
              onConfirm={handleConfirm}
            />
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
      {loadingSubmit && (
        <View style={styles.loading}>
          <Loading />
        </View>
      )}
    </View>
  );
};

export default RegisteredRegistrationScreen;
