import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput,
} from 'react-native';

import { submitNewExpense } from '../redux/actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    justifyContent: 'space-between',
  },
  amount: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004c8c',
    fontWeight: 'bold',
  },
  amount__text: {
    color: 'white',
  },
  amount__value: {
    fontWeight: 'bold',
    color: 'white',
  },
  options: {
    flexGrow: 7,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
  },
  actions: {
    flex: 2,
  },
  add: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgreen',
  },
  cancel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
});

class AddExpenseDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Details',
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.amount}>
          <Text style={styles.amount__text}>New expense: </Text>
          <Text style={styles.amount__value}>{`${this.props.currentExpense.pretty} ${this.props.currentExpense.currency}`}</Text>
        </View>
        <ScrollView style={styles.options} contentContainerStyle={styles.optionsContainer}>
          <View style={styles.option}>
            <View style={styles.option__text}>
              <Text>Category</Text>
            </View>
            <View style={styles.option__value}>
              <TextInput>
                Select
              </TextInput>
            </View>
          </View>
          <View style={styles.option}>
            <View style={styles.option__text}>
              <Text>Tags</Text>
            </View>
            <View style={styles.option__value}>
              <Text>Select</Text>
            </View>
          </View>
          <View style={styles.option}>
            <View style={styles.option__text}>
              <Text>Date</Text>
            </View>
            <View style={styles.option__value}>
              <Text>Select</Text>
            </View>
          </View>
          <View style={styles.option}>
            <View style={styles.option__text}>
              <Text>Comment</Text>
            </View>
            <View style={styles.option__value}>
              <Text>Select</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.add} underlayColor="white">
            <Text>Add expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancel} underlayColor="white">
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
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
