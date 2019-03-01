import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import DatePicker from 'react-native-datepicker';

import { addExpense, submitNewAmount, clearNewExpense } from '../redux/actions';

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
    backgroundColor: '#e64a19',
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
    backgroundColor: '#321911',
  },
  cancel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5d4037',
  },
  action__text: {
    color: 'white',
  },
});

class AddExpenseDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Details',
  };

  state = {
    amount: this.props.currentExpense.amount,
    pretty: this.props.currentExpense.pretty,
    currency: this.props.currentExpense.currency,
    category: null,
    tags: [],
    timestamp: null,
    dateISO: null,
    date: null,
    comment: null,
  };

  componentDidMount() {
    const timestamp = new Date().toISOString();
    this.setState({
      timestamp,
      date: this.computeSimpleDate(timestamp),
    });
  }

  computeSimpleDate = (timestamp) => {
    const date = new Date(timestamp);
    const dd = date.getDate().toString().padStart(2, '0');
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}.${mm}.${dd}`;
  }

  onAdd = () => {
    if (this.state.category != null) {
      this.props.addExpense(this.state);
      this.props.clearNewExpense();
      this.props.navigation.navigate('AddAmount');
    } else {
      Alert.alert('Please enter a category.');
    }
  }

  onCancel = () => {
    this.props.clearNewExpense();
    this.props.navigation.navigate('AddAmount');
  }

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
              <TextInput
                placeholder='Required'
                onChangeText={category => this.setState({ category })}
              />
            </View>
          </View>
          {/* <View style={styles.option}>
            <View style={styles.option__text}>
              <Text>Tags</Text>
            </View>
            <View style={styles.option__value}>
              <TextInput placeholder='Optional' />
            </View>
          </View> */}
          <View style={styles.option}>
            <View style={styles.option__text}>
              <Text>Date</Text>
            </View>
            <DatePicker
              customStyles={{
                dateInput: {
                  borderWidth: 0,
                },
                dateText: {
                  textAlign: 'right',
                  alignSelf: 'stretch',
                },
              }}
              date={this.state.date}
              mode="date"
              placeholder="select date"
              showIcon={false}
              format="YYYY.MM.DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={date => this.setState({ date })}
            />
          </View>
          <View style={styles.option}>
            <View style={styles.option__text}>
              <Text>Comment</Text>
            </View>
            <View style={styles.option__value}>
              <TextInput placeholder='Optional' />
            </View>
          </View>
        </ScrollView>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.add}
            underlayColor="white"
            onPress={this.onAdd}>
            <Text style={styles.action__text}>Add expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancel}
            underlayColor="white"
            onPress={this.onCancel}
          >
            <Text style={styles.action__text}>Cancel</Text>
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
  submitNewAmount: expenseAmount => dispatch(submitNewAmount(expenseAmount)),
  clearNewExpense: () => dispatch(clearNewExpense()),
  addExpense: expense => dispatch(addExpense(expense)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddExpenseDetailsScreen);
