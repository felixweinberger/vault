import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import Numpad from '../components/Numpad';
import AddAmount from '../components/AddAmount';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
});

export default class AddExpenseScreen extends React.Component {
  static navigationOptions = {
    title: 'Add Expense',
  };

  onPressButton() {
    console.log('1'); // eslint-disable-line no-console
  }

  render() {
    return (
      <View style={styles.container}>
        <AddAmount value={123} currency={'€ EUR'} />
        <Numpad />
      </View>
    );
  }
}
