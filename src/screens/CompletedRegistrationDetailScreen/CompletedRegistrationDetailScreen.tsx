import {
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {CompletedRegistrationDetailScreenProps} from './CompletedRegistrationDetailScreen.types';
import {useDispatch} from 'react-redux';
import {IRegistrationDetail} from '../../types';
import {RegistryApi} from '../../services';
import {Header, Loading} from '../../components';
import {styles} from './CompletedRegistrationDetailScreen.styled';
import {converLicensePlate, formatDate} from '../../utils/string';
import {BASE_URL} from '../../config';
import {fonts} from '../../constants';

const CompletedRegistrationDetailScreen: FC<
  CompletedRegistrationDetailScreenProps
> = ({navigation, route}) => {
  const {id, status} = route.params;

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
  console.log(data?.status);

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <Header title="Chi tiết đăng kiểm đã hoàn thành" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleGetData} />
        }>
        <View style={[styles.container, styles.general]}>
          <Text style={styles.title}>Thông tin chung</Text>
          <View style={[styles.row, styles.space_between]}>
            <View style={[styles.row, styles.car]}>
              {data?.carImages ? (
                <Image
                  source={{uri: BASE_URL + data.carImages}}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 3,
                    resizeMode: 'cover',
                    marginRight: 12,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 44,
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: '#394B6A',
                    marginRight: 12,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: fonts.BE_VIETNAM_PRO_REGULAR,
                      fontSize: 9,
                    }}>
                    Chưa thêm ảnh
                  </Text>
                </View>
              )}
              <View>
                <Text style={styles.car_title}>Biển kiểm soát</Text>
                <Text style={styles.car_licensePlate}>
                  {converLicensePlate(data?.license_plate)}
                </Text>
              </View>
            </View>
            {status && status === 1 && <Text style={styles.btn_pass}>Đạt</Text>}
            {status && status === 2 && (
              <Text style={styles.regis_cancel}>Không đạt</Text>
            )}
          </View>
        </View>
        <View style={[styles.container, styles.registry]}>
          <View style={[styles.row, styles.space_between]}>
            <Text style={styles.title}>Thông tin đăng kiểm</Text>
            {data?.address ? (
              <Text style={styles.btn_address}>Đăng kiểm hộ</Text>
            ) : (
              <></>
            )}
          </View>
          <View style={styles.box}>
            <Text style={styles.box_title}>Ngày đăng kiểm</Text>
            <Text style={styles.box_content}>{formatDate(data?.date)}</Text>
          </View>
          {data?.address ? (
            <View style={styles.box}>
              <Text style={styles.box_title}>Thông tin đăng kiểm hộ</Text>
              <Text style={styles.box_content}>{data?.address}</Text>
            </View>
          ) : (
            <></>
          )}
          {status && status === 1 && (
            <>
              <View style={styles.box}>
                <Text style={styles.box_title}>Ngày hết hạn đăng kiểm</Text>
                <Text style={styles.box_content}>{formatDate(data?.date)}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.box_title}>
                  Ngày hết Hạn phí bảo trì đường bộ
                </Text>
                <Text style={styles.box_content}>{formatDate(data?.date)}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CompletedRegistrationDetailScreen;
