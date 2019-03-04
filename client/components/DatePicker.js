import React from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-datepicker';

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
            alignSelf: 'stretch',
            color: props.fontColor,
          },
        }}
        style={{ width: 80 }}
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
