import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useCallback, useMemo} from 'react';
import {RegistryInfoProps} from './RegistryInfo.types';
import {styles} from './RegistryInfo.styled';
import {converLicensePlate, formatDate} from '../../../utils/string';

const RegistryInfo: FC<RegistryInfoProps> = ({
  data,
  type,
  onCancle,
  onConfirm,
  ...props
}) => {
  const handleConfirm = useCallback(() => {
    if (onConfirm) onConfirm(data);
  }, [onConfirm, data]);

  const handleCancel = useCallback(() => {
    if (onCancle) onCancle(data);
  }, [onCancle, data]);

  const renderButton = useMemo(() => {
    switch (type) {
      case 0:
        return (
          <TouchableOpacity
            style={styles.regis_btn_success}
            onPress={handleConfirm}>
            <Text style={styles.regis_btn_text}>Đã thu tiền</Text>
          </TouchableOpacity>
        );
      case 1:
        return (
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={styles.regis_btn_success}
              onPress={handleConfirm}>
              <Text style={styles.regis_btn_text}>Đạt KĐ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.regis_btn_unsuccess}
              onPress={handleCancel}>
              <Text style={styles.regis_btn_text}>Không đạt KĐ</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        if (data.status === 2)
          return <Text style={styles.regis_cancel}>Không đạt</Text>;
        if (data.status === 1)
          return <Text style={styles.regis_complete}>Đạt</Text>;
        return <></>;
      default:
        return <></>;
    }
  }, [type, handleConfirm, handleCancel, data.status]);
  return (
    <TouchableOpacity style={styles.regis} {...props}>
      <View style={styles.regis_group}>
        <Text style={styles.regis_text}>{formatDate(data.date)}</Text>
        {renderButton}
      </View>
      <Text style={styles.regis_licensePlate}>
        {converLicensePlate(data.license_plate).toUpperCase()}
      </Text>
      <Text style={styles.regis_text}>Chủ phương tiện: {data.owner_name}</Text>
      <Text style={styles.regis_text}>Số điện thoại: {data.owner_phone}</Text>
    </TouchableOpacity>
  );
};

export default RegistryInfo;
