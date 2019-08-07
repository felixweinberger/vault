import React from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-datepicker';

import Colors from '../constants/Colors';

export default function AddExpenseDetailsScreen(props) {
  const onDateChange = (date) => {
    props.onDateChange(date);
  };

  return (
    <View>
      <DatePicker
        customStyles={{
          dateInput: {
            borderWidth: 0,
          },
          dateText: {
            textAlign: 'center',
            fontSize: 16,
            alignSelf: 'stretch',
            color: props.fontColor,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: props.fontColor,
          },
          btnTextConfirm: {
            color: Colors.orange6,
          },
        }}
        style={{ width: 100 }}
        date={props.date}
        mode="date"
        placeholder="select date"
        showIcon={false}
        format="YYYY.MM.DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        onDateChange={onDateChange}
      />
    </View>
  );
}
