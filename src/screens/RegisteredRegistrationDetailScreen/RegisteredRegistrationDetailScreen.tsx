import {
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {RegisteredRegistrationDetailScreenProps} from './RegisteredRegistrationDetailScreen.types';
import {RegistryApi} from '../../services';
import {IFormData, IRegistrationDetail} from '../../types';
import {Header, Loading} from '../../components';
import {styles} from './RegisteredRegistrationDetailScreen.styled';
import {
  converLicensePlate,
  convertNonPrice,
  formatDate,
} from '../../utils/string';
import {BASE_URL} from '../../config';
import {fonts} from '../../constants';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';
import dayjs from 'dayjs';
import {useFormik} from 'formik';
import {closeModal, openModal} from '../../redux';
import {TextInputMask} from 'react-native-masked-text';

const RegisteredRegistrationDetailScreen: FC<
  RegisteredRegistrationDetailScreenProps
> = ({navigation, route}) => {
  const {id} = route.params;
  const dispatch = useDispatch();
  const [data, setData] = useState<IRegistrationDetail>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleGetData = useCallback(async () => {
    try {
      setIsLoading(true);
      setData(undefined);
      const res = await RegistryApi.getRegistryDetail(id);
      if (res.status === 1) {
        setData(res.data.registry);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    handleGetData();
  }, []);

  const handleSubmit = useCallback(
    async (formData: IFormData) => {
      try {
        setLoadingSubmit(true);
        const dataSend = {
          id: formData.id,
          fee_5: convertNonPrice(formData.fee_5),
          fee_6: convertNonPrice(formData.fee_6),
          fee_7: convertNonPrice(formData.fee_7),
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
                  date: data?.date ? new Date(data?.date) : new Date(),
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
    },
    [data],
  );

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
      <Header title="Chi tiết Đăng ký đăng kiểm" />
      <ScrollView
        style={styles.scroll_view}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleGetData} />
        }>
        <View style={styles.information}>
          <View style={styles.information_general}>
            <Text style={styles.information_general_title}>
              Thông tin chung
            </Text>
            <Text style={styles.information_general_licensePlates}>
              {converLicensePlate(data?.license_plate)}
            </Text>
          </View>
          <View style={styles.information_address}>
            {data?.carImages ? (
              <Image
                source={{uri: BASE_URL + data?.carImages}}
                style={styles.image}
              />
            ) : (
              <View style={styles.nullImageWrapper}>
                <Text style={styles.nullText}>Chưa thêm ảnh</Text>
              </View>
            )}
            {data?.address ? (
              <View style={styles.information_address_group}>
                <Text style={styles.information_address_content}>
                  Nhờ đăng kiểm hộ
                </Text>
                <Text style={[styles.information_address_content]}>
                  Địa chỉ: {data?.address}
                </Text>
              </View>
            ) : (
              <></>
            )}
          </View>
        </View>
        <View style={[styles.group, {paddingHorizontal: 15}]}>
          <Text style={styles.group_title}>Ngày đăng ký đăng kiểm</Text>
          <Text
            style={{
              ...styles.group_content,
              borderBottomWidth: 0,
              paddingBottom: 0,
            }}>
            {formatDate(data?.date)}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.information_group}>
          <TouchableOpacity
            onPress={() => {
              const url = `tel://${data?.owner_phone}`;
              Linking.openURL(url);
            }}>
            <View style={styles.information_owner}>
              <Text style={styles.information_owner_title}>Chủ xe</Text>
              <View style={styles.information_owner_group}>
                {data && data.userImage ? (
                  <Image
                    source={{uri: BASE_URL + data.userImage}}
                    style={styles.userAvatar}
                  />
                ) : (
                  <Image
                    source={require('../../assets/images/default_avatar.jpg')}
                    style={styles.userAvatar}
                  />
                )}
                <View
                  style={{
                    marginLeft: 10,
                  }}>
                  <Text style={styles.information_owner_name}>
                    {data?.owner_name}
                  </Text>
                  <View style={styles.information_owner_group}>
                    <Image
                      source={require('../../assets/icons/phone_button_icon.png')}
                      style={{
                        width: 14,
                        height: 14,
                      }}
                    />
                    <Text style={styles.information_owner_phone}>
                      {data?.owner_phone}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (data) {
                handleConfirm(data);
              }
            }}
            style={styles.regis_btn_success}>
            <Text
              style={[
                styles.regis_btn_text,
                {
                  color: '#FFFFFF',
                },
              ]}>
              Đã thu tiền
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.information_car}>
          <Text style={styles.information_car_title}>Thông tin xe</Text>
          <View style={styles.group}>
            <Text style={styles.group_title}>Chủng loại phương tiện</Text>
            <Text style={styles.group_content}>{data?.category_name}</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.group_title}>Loại phương tiện</Text>
            <Text style={styles.group_content}>{data?.car_type}</Text>
          </View>
          <View style={styles.group}>
            <Text style={styles.group_title}>Năm sản xuất</Text>
            <Text style={styles.group_content}>{data?.manufacture_at}</Text>
          </View>
        </View>
        <View style={styles.emloyee}>
          <Text style={styles.emloyee_title}>Thông tin đăng kiểm hộ</Text>
          {!isLoading && data && !data.staff_id && (
            <Text style={styles.group_content}>Chưa được phân công</Text>
          )}
          {data?.staff_id ? (
            <>
              <View style={styles.group}>
                <Text style={styles.group_title}>Nhân viên nhận xe</Text>
                <Text style={styles.group_content}>{data?.staff_name}</Text>
              </View>
              <View style={styles.group}>
                <Text style={styles.group_title}>Ngày sinh</Text>
                <Text style={styles.group_content}>{data?.date_birth}</Text>
              </View>
              <View style={styles.group}>
                <Text style={styles.group_title}>CMND số</Text>
                <Text style={styles.group_content}>{data?.id_card}</Text>
              </View>
              <View style={styles.group}>
                <Text style={styles.group_title}>Số điện thoại</Text>
                <Text style={styles.group_content}>{data?.phone_number}</Text>
              </View>
              <View style={styles.group}>
                <Text style={styles.group_title}>Thời gian nhận xe</Text>
                <Text style={styles.group_content}>
                  {data?.car_delivery_time}
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}
        </View>
      </ScrollView>
      {loadingSubmit && (
        <View style={styles.loading}>
          <Loading />
        </View>
      )}
    </View>
  );
};

export default RegisteredRegistrationDetailScreen;
