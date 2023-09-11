import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useCallback} from 'react';
import {RegistryProps} from './Registry.types';
import {styles} from './Registry.styled';
import dayjs from 'dayjs';
import {BASE_URL} from '../../../config';
import {converLicensePlate} from '../../../utils/string';

const Registry: FC<RegistryProps> = ({data, style, onPress}) => {
  const handlePress = useCallback(() => {
    if (onPress) onPress();
  }, [onPress]);

  return (
    <TouchableOpacity style={[styles.box, style]} onPress={handlePress}>
      <View style={styles.box_left}>
        {data.url ? (
          <Image source={{uri: BASE_URL + data.url}} style={styles.image} />
        ) : (
          <View style={styles.nullImage}>
            <Text style={styles.nullImageText}>Chưa thêm ảnh</Text>
          </View>
        )}
      </View>
      <View style={styles.box_right}>
        <Text style={styles.license_plates}>
          {converLicensePlate(data.license_plate)}
        </Text>
        <Text style={styles.content_style}>Loại: {data.name}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          {data.isPay ? (
            <View style={[styles.content_box, {backgroundColor: '#FFE9B1'}]}>
              <Text style={[styles.content_box_style, {color: '#714B14'}]}>
                Chờ đóng phí
              </Text>
            </View>
          ) : (
            <View style={[styles.content_box, {backgroundColor: '#DDF5D6'}]}>
              <Text style={[styles.content_box_style, {color: '#2AA405'}]}>
                Đã đóng phí
              </Text>
            </View>
          )}
          {data.address && (
            <Text style={styles.registration_for}>Nhờ đăng kiểm hộ</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Registry;
