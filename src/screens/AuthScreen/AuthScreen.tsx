import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {AuthScreenProps} from './AuthScreen.types';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from './AuthScreen.styled';
import SlidingUpPanel from 'rn-sliding-up-panel';
import {SCREEN_HEIGHT, colors} from '../../constants';
import {Login} from '../../components';

const AuthScreen: FC<AuthScreenProps> = () => {
  const show = React.useRef<SlidingUpPanel>(null);
  const [toggle, setToggle] = React.useState<boolean>(false);
  const showLoginForm = () => {
    setToggle(!toggle);
  };
  React.useEffect(() => {
    return () => {
      show.current?.show();
    };
  }, [toggle]);

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={['#1C1F2366', '#0A254E']}
        style={styles.container}
      />
      <Image
        style={styles.img_back}
        source={require('../../assets/images/background_image.png')}
      />
      <View style={styles.group}>
        <View style={styles.title}>
          <Text style={styles.title_top}>Ứng dụng Đăng kiểm xe</Text>
          <Text style={styles.title_bot}>
            Đăng ký đăng kiểm xe mọi lúc mọi nơi
          </Text>
        </View>
        <View style={styles.btn_group}>
          <TouchableOpacity
            style={styles.btn_login}
            onPress={() => showLoginForm()}>
            <Text style={[styles.btn_style, {color: colors.WHITE}]}>
              ĐĂNG NHẬP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <SlidingUpPanel
        ref={show}
        draggableRange={{top: SCREEN_HEIGHT * 0.55, bottom: 0}}
        height={SCREEN_HEIGHT * 0.55}
        allowMomentum={true}
        allowDragging={false}
        avoidKeyboard={true}
        backdropOpacity={0}>
        <Login />
      </SlidingUpPanel>
    </View>
  );
};

export default AuthScreen;
