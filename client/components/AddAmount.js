import React from 'react';
import {
  View, StyleSheet, Text, Platform,
} from 'react-native';

const styles = StyleSheet.create({
  amount: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 24,
  },
  amount__value: {
    fontSize: 50,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'monospace',
    color: 'rgba(96,100,109, 1)',
  },
  amount__currency: {
    fontSize: 25,
    color: 'rgba(96,100,109, 1)',
  },
});

export default function AddAmount(props) {
  return (
    <View style={styles.amount}>
      <Text style={styles.amount__value}>
        {props.value}
      </Text>
      <Text style={styles.amount__currency}>
        {props.currency}
      </Text>
    </View>
  );
}
