import React from 'react';
import {
  Text, TouchableOpacity, StyleSheet,
} from 'react-native';


const styles = StyleSheet.create({
  value: {
    color: 'white',
  },
});


export default function NumpadButton(props) {
  const onPress = () => props.onPress(props.value);
  return (
    <TouchableOpacity
      style={props.style}
      underlayColor="white"
      onPress={onPress}
    >
      <Text style={styles.value}>{props.value}</Text>
    </TouchableOpacity>
  );
}
