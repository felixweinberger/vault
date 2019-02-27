import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  contentText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
});

export default class AddExpenseDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Add Expense Screen',
  };

  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.contentText}>
          WIP: Summary page
        </Text>
      </ScrollView>
    );
  }
}
