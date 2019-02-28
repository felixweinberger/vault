import React from 'react';
import {
  Text, TouchableOpacity,
} from 'react-native';

export default function NumpadButton(props) {
  const onPress = () => props.onPress(props.value);
  return (
    <TouchableOpacity
      style={props.style}
      underlayColor="white"
      onPress={onPress}
    >
      <Text>{props.value}</Text>
    </TouchableOpacity>
  );
}
