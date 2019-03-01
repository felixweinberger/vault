import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet, View,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { uniq } from 'lodash';

import { deleteExpense } from '../redux/actions';
import Summary from '../components/Summary';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#e64a19',
    color: 'white',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    backgroundColor: '#efebe9',
  },
});

class SummaryScreen extends React.Component {
  static navigationOptions = {
    title: 'Summary',
  };

  state = {
    expenses: this.props.expenses,
    sections: [],
  }

  computeSections = () => {
    if (this.props.expenses.length > 0) {
      const dates = uniq(this.props.expenses.map(expense => expense.date)).sort();
      const sectionObj = dates.reduce((acc, date) => {
        acc[date] = { title: date, data: [] };
        return acc;
      }, {});
      this.props.expenses.forEach((expense) => {
        sectionObj[expense.date].data.push(expense);
      });
      this.setState({ sections: Object.values(sectionObj) });
    }
  }

  onFocus = () => {
    this.computeSections();
  }

  onDelete = (expense) => {
    this.props.deleteExpense(expense.id);
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this.onFocus} />
        <Summary
          sections={this.state.sections}
          onDelete={this.onDelete}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  expenses: state.expenses,
});

const mapDispatchToProps = dispatch => ({
  deleteExpense: expenseId => dispatch(deleteExpense(expenseId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SummaryScreen);
