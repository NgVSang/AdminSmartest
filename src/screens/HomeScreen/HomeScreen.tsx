import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useCallback, useEffect, useMemo} from 'react';
import {HomeAdminScreenProps} from './HomeScreen.types';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {styles} from './HomeScreen.styled';
import {BASE_URL} from '../../config';
import {RegistryApi} from '../../services';
import dayjs from 'dayjs';
import {IRegistration} from '../../types';
import {Registry} from '../../components';

const HomeAdminScreen: FC<HomeAdminScreenProps> = ({navigation}) => {
  const {info} = useSelector(authSelector);
  const [data, setData] = React.useState<IRegistration[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const insets = useSafeAreaInsets();

  const buttons = useMemo(() => {
    return [
      {
        name: 'Lịch theo dõi đăng kiểm',
        icon: require('../../assets/icons/registry_history_icon.png'),
        onPress: () => {
          navigation.push('MonitoringSchedule');
        },
      },
      {
        name: 'DS Đã đăng ký đăng kiểm',
        icon: require('../../assets/icons/car_list_icon.png'),
        onPress: () => {
          navigation.push('RegisteredRegistration');
        },
      },
      {
        name: 'DS Đăng kiểm đã thu tiền',
        icon: require('../../assets/icons/registries_payment_icon.png'),
        onPress: () => {
          navigation.push('PaidRegistration', {});
        },
      },
      {
        name: 'DS hoàn thành đăng kiểm',
        icon: require('../../assets/icons/registries_complete_icon.png'),
        onPress: () => {
          navigation.push('CompletedRegistration', {});
        },
      },
      {
        name: 'Xem bảng chấm công',
        icon: require('../../assets/icons/timesheet_icon.png'),
        onPress: () => {
          // navigation.push('Infringe');
        },
      },
      {
        name: 'Xem bảng lương',
        icon: require('../../assets/icons/salary_icon.png'),
        onPress: () => {
          // navigation.push('Infringe');
        },
      },
      {
        name: 'Thông tin tài khoản',
        icon: require('../../assets/icons/profile_icon.png'),
        onPress: () => {
          navigation.push('Profile');
        },
      },
    ];
  }, []);

  const handleGetData = useCallback(async () => {
    try {
      setIsLoading(true);
      setData([]);
      const res = await RegistryApi.getRegistriesByDate(
        dayjs(new Date()).format('YYYY-MM-DD'),
      );
      if (res.status === 1) {
        setData(res.data.registries);
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
    <View style={styles.screen}>
      <View
        style={[
          styles.header,
          {
            marginTop: insets.top,
          },
        ]}>
        <TouchableOpacity
          style={styles.header_left}
          onPress={() => navigation.push('Profile')}>
          <Image
            source={{
              uri:
                BASE_URL + info?.avatar?.replace('http://localhost:8000/', ''),
            }}
            style={{
              width: 40,
              height: 40,
              resizeMode: 'cover',
              borderRadius: 6,
              marginRight: 10,
            }}
          />
          <View>
            <Text style={styles.header_left_name}>{info?.name}</Text>
            <Text style={styles.header_left_hi}>Nhân viên</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scroll_view}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleGetData} />
        }>
        <View style={styles.manager}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              style={styles.manager_box}
              key={index}
              onPress={button.onPress}>
              <View style={styles.manager_box_icon}>
                <Image source={button.icon} style={styles.icon_style} />
              </View>
              <Text style={styles.manager_content}>{button.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.register}>
          <View style={styles.register_title}>
            <Text style={styles.register_title_left}>
              Lịch đăng kiểm hôm nay {dayjs(new Date()).format('DD/MM')}
            </Text>
            <Text style={styles.register_title_right}>{data.length} xe</Text>
          </View>
          {!isLoading && data.length === 0 && (
            <Text style={styles.registerNull}>
              Hôm nay không có lịch đăng kiểm
            </Text>
          )}
          {data.map(registry => (
            <Registry
              key={registry.id}
              data={registry}
              style={styles.box_style}
              onPress={() => {
                // navigation.navigate('FollowUpCheckin', {
                //   regisId: registration.id,
                // })
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeAdminScreen;
