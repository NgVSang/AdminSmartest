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
import {MonitorRegistrationDetailScreenProps} from './MonitorRegistrationDetailScreen.types';
import {Header} from '../../components';
import {styles} from './MonitorRegistrationDetailScreen.styled';
import {RegistryApi} from '../../services';
import {IRegistrationDetail} from '../../types';
import {converLicensePlate} from '../../utils/string';
import {BASE_URL} from '../../config';
import {fonts} from '../../constants';

const MonitorRegistrationDetailScreen: FC<
  MonitorRegistrationDetailScreenProps
> = ({navigation, route}) => {
  const {id} = route.params;
  console.log(id);

  const [data, setData] = useState<IRegistrationDetail>();
  const [isLoading, setIsLoading] = useState(true);

  const handleGetData = useCallback(async () => {
    try {
      setIsLoading(true);
      setData(undefined);
      const res = await RegistryApi.getRegistryDetail(id);
      if (res.status === 1) {
        console.log(res.data);
        setData(res.data.registry);
      } else {
        //@ts-ignore
        throw new Error(res.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <Header title="Theo dõi khám đăng kiểm" />
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
            {data && data.carImages ? (
              <Image
                source={{uri: BASE_URL + data?.carImages}}
                style={{
                  width: 60,
                  height: 60,
                  resizeMode: 'cover',
                  borderRadius: 6,
                }}
              />
            ) : (
              <View style={styles.nullWrapper}>
                <Text style={styles.nullText}>Chưa thêm ảnh</Text>
              </View>
            )}
            {data && data.address && (
              <View style={styles.information_address_group}>
                <Text style={styles.information_address_content}>
                  Nhờ đăng kiểm hộ
                </Text>
                <Text style={styles.information_address_content}>
                  Địa chỉ: {data.address}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.line} />
        <View>
          <TouchableOpacity
            onPress={() => {
              if (data && data.owner_phone) {
                const url = `tel://${data?.owner_phone}`;
                Linking.openURL(url);
              }
            }}
            style={{alignSelf: 'flex-start'}}>
            <View style={styles.information_owner}>
              <Text style={styles.information_owner_title}>Chủ xe</Text>
              <View style={styles.information_owner_group}>
                {data && data.userImage ? (
                  <Image
                    source={{uri: BASE_URL + data.userImage}}
                    style={{
                      width: 44,
                      height: 44,
                      resizeMode: 'cover',
                      borderRadius: 6,
                    }}
                  />
                ) : (
                  <Image
                    source={require('../../assets/images/default_avatar.jpg')}
                    style={{
                      width: 44,
                      height: 44,
                      resizeMode: 'cover',
                      borderRadius: 6,
                    }}
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
        </View>
      </ScrollView>
    </View>
  );
};

export default MonitorRegistrationDetailScreen;
