import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { submitNewExpense } from '../redux/actions';

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

class AddExpenseDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Add Expense Details',
  };

  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.contentText}>
          {JSON.stringify(this.props.currentExpense)}
        </Text>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  currentExpense: state.currentExpense,
});

const mapDispatchToProps = dispatch => ({
  submitNewExpense: expense => dispatch(submitNewExpense(expense)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddExpenseDetailsScreen);
