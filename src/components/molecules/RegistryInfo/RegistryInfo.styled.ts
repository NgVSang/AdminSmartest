import {StyleSheet} from 'react-native';
import {colors, fonts} from '../../../constants';

export const styles = StyleSheet.create({
  regis: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomColor: '#E1E9F6',
    borderBottomWidth: 1,
  },
  regis_text: {
    fontFamily: fonts.BE_VIETNAM_PRO_REGULAR,
    fontSize: 13,
    lineHeight: 18,
    color: '#394B6A',
    opacity: 0.8,
    marginBottom: 6,
  },
  regis_licensePlate: {
    fontFamily: fonts.BE_VIETNAM_PRO_SEMIBOLD,
    fontSize: 14,
    lineHeight: 22,
    color: '#2C3442',
    marginBottom: 6,
  },
  regis_group: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  regis_btn_success: {
    paddingHorizontal: 18,
    paddingVertical: 4,
    backgroundColor: '#0F6AA9',
    borderRadius: 3,
  },
  regis_btn_unsuccess: {
    paddingHorizontal: 18,
    paddingVertical: 4,
    backgroundColor: '#8D91A1',
    borderRadius: 3,
    marginLeft: 5,
  },
  regis_btn_text: {
    fontFamily: fonts.BE_VIETNAM_PRO_BOLD,
    fontSize: 12,
    lineHeight: 22,
    color: colors.WHITE,
  },
  regis_cancel: {
    fontFamily: fonts.BE_VIETNAM_PRO_MEDIUM,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    color: '#8B2929',
    paddingHorizontal: 20,
    paddingVertical: 4,
    backgroundColor: '#F1D5D5',
    borderRadius: 100,
  },
  regis_complete: {
    fontFamily: fonts.BE_VIETNAM_PRO_MEDIUM,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    color: '#008334',
    paddingHorizontal: 38,
    paddingVertical: 4,
    backgroundColor: '#BCEBCF',
    borderRadius: 100,
  },
});
