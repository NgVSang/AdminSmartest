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
import {
  DateInput,
  Header,
  Loading,
  RegistryInfo,
  SearchBar,
} from '../../components';
import {RegistryApi} from '../../services';
import dayjs from 'dayjs';
import {IFormData, IRegistrationDetail} from '../../types';
import {styles} from './PaidRegistrationScreen.styled';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch} from 'react-redux';
import {closeModal, openModal} from '../../redux';
import {converLicensePlate, convertDate, formatDate} from '../../utils/string';
import {fonts} from '../../constants';
import {useFormik} from 'formik';
import Toast from 'react-native-toast-message';

const PaidRegistrationScreen: FC<PaidRegistrationScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(route.params.date || new Date());
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

  const handleSubmit = useCallback(async (data: IFormData) => {
    try {
      setLoadingSubmit(true);
      const dataSubmit = {
        id: data.id,
        type: data.type,
        plan_date:
          convertDate(data.plan_date) === ''
            ? undefined
            : convertDate(data.plan_date),
        cost_plan_date:
          convertDate(data.cost_plan_date) === ''
            ? undefined
            : convertDate(data.cost_plan_date),
      };
      console.log(dataSubmit);
      const res = await RegistryApi.handleComplete(dataSubmit);

      if (res.status === 1) {
        navigation.reset({
          index: 1,
          routes: [
            {name: 'Bottom'},
            {
              name: 'CompletedRegistration',
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
      type: '',
      plan_date: '',
      cost_plan_date: '',
    },
    onSubmit: handleSubmit,
  });

  const handleInputDate = useCallback(
    (data: IRegistrationDetail) => {
      dispatch(
        openModal({
          content: (
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 6,
              }}>
              <Text style={styles.modal_title}>Xác nhận Đạt</Text>
              <View style={styles.modal_select}>
                <Text style={styles.modal_select_title}>Có hiệu lực đến</Text>
                <DateInput
                  date={formik.values.plan_date}
                  onChangeDate={date => {
                    formik.setFieldValue('plan_date', date);
                  }}
                  onBlur={formik.handleBlur('date')}
                />
              </View>
              <View style={styles.modal_select}>
                <Text style={styles.modal_select_title}>
                  Ngày đóng phí bảo trì đường bộ
                </Text>
                <DateInput
                  date={formik.values.cost_plan_date}
                  onChangeDate={date => {
                    formik.setFieldValue('cost_plan_date', date);
                  }}
                  onBlur={formik.handleBlur('date')}
                />
              </View>
            </View>
          ),
          handleConfirm: () => {
            formik.setFieldValue('type', 1);
            formik.handleSubmit();
          },
        }),
      );
    },
    [dispatch, formik],
  );

  const modalConent = useCallback((data: IRegistrationDetail, type: 1 | 0) => {
    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 6,
          padding: 22,
        }}>
        <Text style={styles.modal_text}>
          Xe có biển kiếm soát
          <Text style={{fontFamily: fonts.BE_VIETNAM_PRO_BOLD}}>
            {' '}
            {converLicensePlate(data.license_plate)}
          </Text>{' '}
          đăng kiểm ngày
          <Text style={{fontFamily: fonts.BE_VIETNAM_PRO_BOLD}}>
            {' '}
            {formatDate(data?.date)}
          </Text>{' '}
          {type === 1 ? 'đạt kiểm định' : 'không đạt kiểm định'}
        </Text>
      </View>
    );
  }, []);

  const handleConfirm = useCallback(
    (data: IRegistrationDetail) => {
      dispatch(
        openModal({
          content: modalConent(data, 1),
          handleConfirm: async () => {
            await dispatch(closeModal());
            formik.setFieldValue('id', data.id.toString());
            handleInputDate(data);
          },
        }),
      );
    },
    [handleInputDate],
  );

  const handleCancle = useCallback(
    (data: IRegistrationDetail) => {
      dispatch(
        openModal({
          content: modalConent(data, 0),
          handleConfirm: async () => {
            formik.setValues({
              id: data.id.toString(),
              cost_plan_date: '',
              plan_date: '',
              type: '0',
            });
            formik.handleSubmit();
            dispatch(closeModal());
          },
        }),
      );
    },
    [formik],
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
            <RegistryInfo
              data={registry}
              type={1}
              key={registry.id}
              onConfirm={handleConfirm}
              onCancle={handleCancle}
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

export default PaidRegistrationScreen;
