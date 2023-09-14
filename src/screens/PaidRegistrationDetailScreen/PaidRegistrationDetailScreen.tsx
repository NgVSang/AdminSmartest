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
import {PaidRegistrationDetailScreenProps} from './PaidRegistrationDetailScreen.types';
import {useDispatch} from 'react-redux';
import {RegistryApi} from '../../services';
import {IFormData, IRegistrationDetail} from '../../types';
import {DateInput, Header, Loading} from '../../components';
import {styles} from './PaidRegistrationDetailScreen.styled';
import {BASE_URL} from '../../config';
import {converLicensePlate, convertDate, formatDate} from '../../utils/string';
import {closeModal, openModal} from '../../redux';
import {fonts} from '../../constants';
import {useFormik} from 'formik';
import Toast from 'react-native-toast-message';

const PaidRegistrationDetailScreen: FC<PaidRegistrationDetailScreenProps> = ({
  navigation,
  route,
}) => {
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

  const handleSubmit = useCallback(async (formData: IFormData) => {
    try {
      setLoadingSubmit(true);
      const dataSubmit = {
        id: formData.id,
        type: formData.type,
        plan_date:
          convertDate(formData.plan_date) === ''
            ? undefined
            : convertDate(formData.plan_date),
        cost_plan_date:
          convertDate(formData.cost_plan_date) === ''
            ? undefined
            : convertDate(formData.cost_plan_date),
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
                date: data?.date ? new Date(data.date) : new Date(),
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
      <Header title="Chi tiết đăng kiểm đã thu tiền" />
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
            }}
            style={{alignItems: 'center'}}>
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
          <View>
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
                Đạt KĐ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (data) {
                  handleCancle(data);
                }
              }}
              style={styles.regis_btn_unsuccess}>
              <Text
                style={[
                  styles.regis_btn_text,
                  {
                    color: '#FFFFFF',
                  },
                ]}>
                Không đạt KĐ
              </Text>
            </TouchableOpacity>
          </View>
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

export default PaidRegistrationDetailScreen;
