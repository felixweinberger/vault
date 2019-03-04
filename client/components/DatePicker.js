import React from 'react';
import DatePicker from 'react-native-datepicker';

export default function AddExpenseDetailsScreen(props) {
  const onDateChange = (date) => {
    props.onDateChange(date);
  };

  return (
    <DatePicker
      customStyles={{
        dateInput: {
          borderWidth: 0,
        },
        dateText: {
          textAlign: 'right',
          alignSelf: 'stretch',
        },
      }}
      date={props.date}
      mode="date"
      placeholder="select date"
      showIcon={false}
      format="YYYY.MM.DD"
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      onDateChange={onDateChange}
    />
  );
}
