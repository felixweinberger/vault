import React from 'react';
import {
  View, StyleSheet, Text, Platform, TouchableOpacity,
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
  },
  amount__currency: {
    fontSize: 20,
    padding: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
});

export default function AddAmount(props) {
  return (
    <View style={styles.amount}>
      <Text style={styles.amount__value}>
        {props.value}
      </Text>
      <TouchableOpacity onPress={props.onCurrencyPress}>
        <Text style={styles.amount__currency}>{props.currency} ({props.symbol})</Text>
      </TouchableOpacity>
    </View>
  );
}
