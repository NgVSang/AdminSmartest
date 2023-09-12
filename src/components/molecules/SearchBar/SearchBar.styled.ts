import {StyleSheet} from 'react-native';
import {colors} from '../../../constants';

export const styles = StyleSheet.create({
  search_style: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E9F6',
  },
  inputStyle: {
    marginLeft: 10,
    color: colors.LIGHT_GRAY,
  },
});
