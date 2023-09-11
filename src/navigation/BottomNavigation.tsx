import {StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigate} from './types';
import {TabBottomItem} from '../components';
import {colors, fonts} from '../constants';
import {HomeScreen, NotificationScreen} from '../screens';

const Tab = createBottomTabNavigator<BottomNavigate>();

const BottomNavigation: FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: props => (
            <Text
              style={[
                styles.tabBarText,
                {
                  color: props.focused ? colors.BLUE : colors.DARK_BLUE,
                },
              ]}>
              TRANG CHỦ
            </Text>
          ),
          tabBarIcon: props => (
            <TabBottomItem
              props={props}
              icon={require('../assets/icons/home_icon.png')}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="NotificationTab"
        component={NotificationScreen}
        options={{
          tabBarLabel: props => (
            <Text
              style={[
                styles.tabBarText,
                {
                  color: props.focused ? colors.BLUE : colors.DARK_BLUE,
                },
              ]}>
              THÔNG BÁO
            </Text>
          ),
          tabBarIcon: props => (
            <TabBottomItem
              props={props}
              icon={require('../assets/icons/notification_icon.png')}
            />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  iconProvider: {},
  icon: {},
  tabBarText: {
    fontFamily: fonts.BE_VIETNAM_PRO_MEDIUM,
    fontSize: 10,
  },
});
