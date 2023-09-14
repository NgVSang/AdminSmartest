import {Alert, Platform, View, Clipboard} from 'react-native';
import React, {FC, PropsWithChildren, useEffect} from 'react';
import {PERMISSIONS, request} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import {useDispatch} from 'react-redux';
import {setFcmToken} from '../../redux';

const NotificationProvider: FC<PropsWithChildren> = ({children}) => {
  const dispatch = useDispatch();

  const handleSubscribe = async () => {
    if (Platform.OS === 'android') {
      await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    }
    try {
      // Đăng ký thiết bị cho FCM
      await messaging().registerDeviceForRemoteMessages();

      // Lấy mã thiết bị
      const fcmToken = await messaging().getToken();
      console.log(fcmToken);

      dispatch(setFcmToken(fcmToken));
    } catch (error: any) {
      Alert.alert('Lỗi', error);
      console.error('Error subscribing to FCM:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'A new FCM message arrived!',
        JSON.stringify(remoteMessage.data),
      );
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log(JSON.parse(remoteMessage.data?.data || ''));
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(remoteMessage);
      if (remoteMessage) {
        const data = JSON.parse(remoteMessage.data?.data || '');
        if (data && data.detail.notiId) {
        }
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log(remoteMessage);

        if (remoteMessage) {
          const data = JSON.parse(remoteMessage.data?.data || '');
          if (data && data.detail.notiId) {
          }
        }
      });
    return unsubscribe;
  }, []);

  useEffect(() => {
    handleSubscribe();
  }, []);

  return <View style={{flex: 1}}>{children}</View>;
};

export default NotificationProvider;
