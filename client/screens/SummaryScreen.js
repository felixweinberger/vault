import React from 'react';
import { connect } from 'react-redux';
import {
  SectionList, StyleSheet, Text, View,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { uniq } from 'lodash';

import { deleteExpense } from '../redux/actions';

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
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
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

  onFocus = () => {
    this.computeSections();
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this.onFocus} />
        <SectionList
          sections={this.state.sections}
          renderItem={({ item }) => <Text style={styles.item}>{item.pretty}</Text>}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          keyExtractor={(item, index) => index}
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
