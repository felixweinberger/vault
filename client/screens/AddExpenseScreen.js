import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  amount: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amount__value: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  amount__currency: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  numpad: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  numpadLeft: {
    flex: 3,
  },
  numpad__oneToNine: {
    flex: 3,
  },
  numpad__row: {
    flex: 1,
    flexDirection: 'row',
  },
  numpad__number: {
    flex: 1,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  numpad__zeroComma: {
    flex: 1,
    flexDirection: 'row',
  },
  numpad__zero: {
    flex: 2,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  numpad__comma: {
    flex: 1,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  numpadRight: {
    flex: 1,
  },
  numpad__back: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  numpad__submit: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgreen',
    borderWidth: 0.5,
    borderColor: '#fff',
  },
});

export default class AddExpenseScreen extends React.Component {
  static navigationOptions = {
    title: 'Add Expense',
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.amount}>
          <Text style={styles.amount__value}>XXX </Text>
          <Text style={styles.amount__currency}>EUR</Text>
        </View>
        <View style={styles.numpad}>
          <View style={styles.numpadLeft}>
            <View style={styles.numpad__oneToNine}>
              <View style={styles.numpad__row}>
                <View style={styles.numpad__number}><Text>1</Text></View>
                <View style={styles.numpad__number}><Text>2</Text></View>
                <View style={styles.numpad__number}><Text>3</Text></View>
              </View>
              <View style={styles.numpad__row}>
                <View style={styles.numpad__number}><Text>4</Text></View>
                <View style={styles.numpad__number}><Text>5</Text></View>
                <View style={styles.numpad__number}><Text>6</Text></View>
              </View>
              <View style={styles.numpad__row}>
                <View style={styles.numpad__number}><Text>7</Text></View>
                <View style={styles.numpad__number}><Text>8</Text></View>
                <View style={styles.numpad__number}><Text>9</Text></View>
              </View>
            </View>
            <View style={styles.numpad__zeroComma}>
              <View style={styles.numpad__zero}><Text>0</Text></View>
              <View style={styles.numpad__comma}><Text>,</Text></View>
            </View>
          </View>
          <View style={styles.numpadRight}>
            <View style={styles.numpad__back}><Text>⇤</Text></View>
            <View style={styles.numpad__submit}><Text>↩︎</Text></View>
          </View>
        </View>
      </View>
    );
  }
}
