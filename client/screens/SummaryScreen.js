import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet, View,
} from 'react-native';
import { uniq } from 'lodash';

import { deleteExpense } from '../redux/actions';
import Summary from '../components/Summary';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class SummaryScreen extends React.Component {
  static navigationOptions = {
    title: 'Summary',
  };

  computeByDate = () => {
    const expenseArr = Object.values(this.props.state.entities.expenses);
    if (expenseArr.length > 0) {
      const dates = uniq(expenseArr.map(expense => expense.date)).sort((a, b) => a < b);
      const sectionObj = dates.reduce((acc, date) => {
        acc[date] = { title: date, data: [] };
        return acc;
      }, {});
      expenseArr.forEach((expense) => {
        sectionObj[expense.date].data.push(expense);
      });
      return Object.values(sectionObj);
    }
    return [];
  }

  onDelete = (expenseId) => {
    this.props.deleteExpense(expenseId);
  }

  render() {
    const sections = this.computeByDate();
    return (
      <View style={styles.container}>
        <Summary
          sections={sections}
          onDelete={this.onDelete}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({ state });

const mapDispatchToProps = dispatch => ({
  deleteExpense: expenseId => dispatch(deleteExpense(expenseId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SummaryScreen);
