import {Alert, BackHandler, Text, View} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector, closeModal} from '../redux';
import {colors} from '../constants';
import {setHeaderConfigAxios, NavigationService} from '../services';
import {
  AuthScreen,
  CompletedRegistrationDetailScreen,
  CompletedRegistrationScreen,
  MonitorRegistrationDetailScreen,
  MonitoringScheduleScreen,
  PaidRegistrationDetailScreen,
  PaidRegistrationScreen,
  ProfileScreen,
  RegisteredRegistrationDetailScreen,
  RegisteredRegistrationScreen,
} from '../screens';
import BottomNavigation from './BottomNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: FC = () => {
  const dispatch = useDispatch();
  const {loggedin, info, access_token} = useSelector(authSelector);

  const [isLoading, setIsLoading] = useState(true);

  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);
  NavigationService.initialize(navigationRef);

  useEffect(() => {
    dispatch(closeModal());
    if (loggedin && access_token) {
      setHeaderConfigAxios(access_token);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Custom BackHandler listener
    const handleBackPress = () => {
      if (NavigationService.canGoBack()) {
        NavigationService.pop();
      } else {
        Alert.alert('Thoát', 'Bạn có muốn đóng ứng dụng không?', [
          {
            text: 'Cancel',
            onPress: () => {},
          },
          {
            text: 'Ok',
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]);
      }
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    // Remove listener
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  if (isLoading) {
    return <View style={{backgroundColor: colors.WHITE}} />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={loggedin ? 'Bottom' : 'Auth'}
        screenOptions={{
          animation: 'simple_push',
          headerShown: false,
        }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Bottom" component={BottomNavigation} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen
          name="MonitoringSchedule"
          component={MonitoringScheduleScreen}
        />
        <Stack.Screen
          name="MonitorRegistrationDetail"
          component={MonitorRegistrationDetailScreen}
        />
        <Stack.Screen
          name="RegisteredRegistration"
          component={RegisteredRegistrationScreen}
        />
        <Stack.Screen
          name="RegisteredRegistrationDetail"
          component={RegisteredRegistrationDetailScreen}
        />
        <Stack.Screen
          name="PaidRegistration"
          component={PaidRegistrationScreen}
        />
        <Stack.Screen
          name="PaidRegistrationDetail"
          component={PaidRegistrationDetailScreen}
        />
        <Stack.Screen
          name="CompletedRegistration"
          component={CompletedRegistrationScreen}
        />
        <Stack.Screen
          name="CompletedRegistrationDetail"
          component={CompletedRegistrationDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
