import {StyleSheet} from 'react-native';
import {fonts} from '../../constants';

export const styles = StyleSheet.create({
  scroll_view: {
    flex: 1,
  },
  information: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 30,
  },
  information_general: {
    flex: 1,
    marginRight: 20,
  },
  nullWrapper: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EFF2F8',
  },
  nullText: {
    textAlign: 'center',
    fontFamily: fonts.BE_VIETNAM_PRO_REGULAR,
    fontSize: 13,
  },
  information_general_title: {
    fontFamily: fonts.BE_VIETNAM_PRO_BOLD,
    color: '#2C3442',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  information_general_licensePlates: {
    fontFamily: fonts.BE_VIETNAM_PRO_BOLD,
    color: '#2C3442',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  information_address: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  information_address_group: {
    flex: 1,
    marginRight: 5,
  },
  information_address_content: {
    fontFamily: fonts.BE_VIETNAM_PRO_REGULAR,
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 18,
    color: '#394B6A',
    opacity: 0.8,
  },
  line: {
    marginLeft: 30,
    marginRight: 70,
    paddingLeft: 30,
    paddingRight: 70,
    height: 1,
    backgroundColor: '#E1E9F6',
    marginVertical: 25,
  },
  information_owner: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    borderBottomColor: '#E1E9F6',
    borderBottomWidth: 1,
  },
  information_owner_title: {
    fontFamily: fonts.BE_VIETNAM_PRO_REGULAR,
    fontSize: 12,
    lineHeight: 18,
    color: '#394B6A',
    opacity: 0.8,
    marginBottom: 6,
  },
  information_owner_name: {
    fontFamily: fonts.BE_VIETNAM_PRO_MEDIUM,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#2E333D',
    marginBottom: 6,
  },
  information_owner_group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  information_owner_phone: {
    fontFamily: fonts.BE_VIETNAM_PRO_REGULAR,
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 20,
    color: '#2E333D',
    marginLeft: 6,
  },
  information_car: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  information_car_title: {
    fontFamily: fonts.BE_VIETNAM_PRO_BOLD,
    color: '#2C3442',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  group: {
    marginTop: 15,
  },
  group_title: {
    fontFamily: fonts.BE_VIETNAM_PRO_REGULAR,
    color: '#2C3442',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  group_content: {
    paddingVertical: 10,
    borderBottomColor: '#E1E9F6',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    fontFamily: fonts.BE_VIETNAM_PRO_SEMIBOLD,
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3442',
  },
});
