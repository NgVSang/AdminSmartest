import {StyleSheet} from 'react-native';
import {fonts} from '../../constants';

export const styles = StyleSheet.create({
  calender: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomColor: '#E1E9F6',
    borderBottomWidth: 1,
  },
  calender_title: {
    fontFamily: fonts.BE_VIETNAM_PRO_REGULAR,
    fontSize: 13,
    lineHeight: 18,
    color: '#394B6A',
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  dataNull: {
    fontFamily: fonts.BE_VIETNAM_PRO_REGULAR,
    fontSize: 18,
    lineHeight: 28,
    color: '#394B6A',
    textAlign: 'center',
    marginTop: 30,
  },
  modal_title: {
    fontFamily: fonts.BE_VIETNAM_PRO_BOLD,
    fontSize: 16,
    lineHeight: 22,
    color: '#2C3442',
    padding: 20,
    paddingBottom: 15,
    borderBottomColor: '#E1E9F6',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  modal_select: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modal_select_title: {
    fontFamily: fonts.BE_VIETNAM_PRO_REGULAR,
    fontSize: 13,
    lineHeight: 20,
    color: '#5C5F62',
    marginBottom: 6,
  },
  modal_select_input: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#E1E9F6',
  },
  modal_select_text: {
    fontFamily: fonts.BE_VIETNAM_PRO_REGULAR,
    fontSize: 13,
    lineHeight: 20,
    color: '#36383A',
    opacity: 0.5,
  },
});
