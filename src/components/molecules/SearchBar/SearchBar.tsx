import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {FC} from 'react';
import {SearchBarProps} from './SearchBar.types';
import {styles} from './SearchBar.styled';
import {colors} from '../../../constants';

const SearchBar: FC<SearchBarProps> = ({
  placeholder = 'Nhập biển số xe/chủ xe ',
  style,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[styles.search_style, containerStyle]}>
      <Image
        source={require('../../../assets/icons/search_icon.png')}
        style={{
          width: 14,
          height: 14,
        }}
      />
      <TextInput
        placeholder={placeholder}
        style={[styles.inputStyle, style]}
        placeholderTextColor={colors.SLATE_GRAY}
        {...props}
      />
    </View>
  );
};

export default SearchBar;
