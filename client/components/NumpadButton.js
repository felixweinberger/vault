import React from 'react';
import {
  Text, TouchableOpacity,
} from 'react-native';

export default function NumpadButton(props) {
  const onPressButton = () => {
    console.log(props.value); // eslint-disable-line no-console
  };

  return (
    <TouchableOpacity
      style={props.style}
      underlayColor="white"
      onPress={onPressButton}
    >
      <Text>{props.value}</Text>
    </TouchableOpacity>
  );
}
