import {Alert, BackHandler, Text, View} from 'react-native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {authSelector} from '../redux';
import {colors} from '../constants';
import {setHeaderConfigAxios, NavigationService} from '../services';
import {AuthScreen, ProfileScreen} from '../screens';
import BottomNavigation from './BottomNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: FC = () => {
  const {loggedin, info, access_token} = useSelector(authSelector);

  const [isLoading, setIsLoading] = useState(true);

  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);
  NavigationService.initialize(navigationRef);

  useEffect(() => {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
