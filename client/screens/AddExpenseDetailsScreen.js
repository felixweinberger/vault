import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import DatePicker from 'react-native-datepicker';

import { addExpense, submitNewAmount, clearNewExpense } from '../redux/actions';
import Colors from '../constants/Colors';

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
    backgroundColor: Colors.totalBackground,
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
  option: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
  },
  category: {
    flex: 3,
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  category__label: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category__scrollview: {
    flexGrow: 2,
  },
  category__list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  category__listitem: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  actions: {
    flex: 2,
  },
  add: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.addButton,
  },
  cancel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cancelButton,
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

  computeCategories = (categories) => {
    const categoryList = Object.keys(categories).sort((a, b) => categories[b] - categories[a]);
    const categoryBtns = categoryList
      .filter((cat) => {
        if (!this.state.category) return true;
        return cat.indexOf(this.state.category.toLowerCase()) !== -1;
      })
      .map(cat => (
        <TouchableOpacity
          key={cat}
          style={styles.category__listitem}
          onPress={() => this.setState({ category: cat })}
        >
          <Text>
            {cat}
          </Text>
        </TouchableOpacity>
      ));
    return categoryBtns;
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
        <View style={styles.options}>
          <View style={styles.category}>
            <View style={styles.category__label}>
              <View style={styles.category__text}>
                <Text>Category</Text>
              </View>
              <View style={styles.category__value}>
                <TextInput
                  placeholder='Required'
                  value={this.state.category ? this.state.category : null}
                  onChangeText={category => this.setState({ category })}
                />
              </View>
            </View>
            <ScrollView
              style={styles.category__scrollview}
              contentContainerStyle={styles.category__list}>
              {this.computeCategories(this.props.categories)}
            </ScrollView>
          </View>
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
              <TextInput
                placeholder='Optional'
                onChangeText={comment => this.setState({ comment })}
              />
            </View>
          </View>
        </View>
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
  categories: state.categories,
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
