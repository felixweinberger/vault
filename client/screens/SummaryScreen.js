import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import { uniq } from 'lodash';

import Colors from '../constants/Colors';
import { deleteExpense } from '../redux/actions';
import Summary from '../components/Summary';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterBtns: {
    backgroundColor: Colors.greyDark,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
  },
  filterBtn: {
    paddingRight: 10,
  },
  filterBtn__label: {
    color: 'white',
    fontWeight: 'bold',
    paddingRight: 10,
  },
  filterBtn__text: {
    color: 'white',
  },
});

class SummaryScreen extends React.Component {
  static navigationOptions = {
    title: 'Summary',
  };

  state = {
    list: 'categories',
  }

  computeSectionsByDate = () => {
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

  computeSectionsByCategory = () => {
    const expenseArr = Object.values(this.props.state.entities.expenses);
    if (expenseArr.length > 0) {
      const categoryTotals = expenseArr
        .reduce((acc, el) => {
          acc[el.category] = acc[el.category]
            ? (acc[el.category] * 100 + el.inMainCurrency * 100) / 100
            : el.inMainCurrency;
          return acc;
        }, {});

      const sortedCategories = Object.keys(categoryTotals)
        .sort((a, b) => categoryTotals[b] - categoryTotals[a]);

      const sectionObj = sortedCategories.reduce((acc, category) => {
        acc[category] = { title: category, data: [] };
        return acc;
      }, {});

      expenseArr.forEach((expense) => {
        sectionObj[expense.category].data.push(expense);
      });
      return Object.values(sectionObj);
    }
    return [];
  }

  onDelete = (expenseId) => {
    this.props.deleteExpense(expenseId);
  }

  onPressHistory = () => {
    this.setState({ list: 'history' });
  }

  onPressCategories = () => {
    this.setState({ list: 'categories' });
  }

  render() {
    let sections;
    if (this.state.list === 'history') {
      sections = this.computeSectionsByDate();
    } else if (this.state.list === 'categories') {
      sections = this.computeSectionsByCategory();
    }

    return (
      <View style={styles.container}>
        <Summary sections={sections} onDelete={this.onDelete} list={this.state.list} />
        <View style={styles.filterBtns}>
          <Text style={styles.filterBtn__label}>Filter dates:</Text>
          <TouchableOpacity style={styles.filterBtn} underlayColor="white" onPress={this.onPressHistory}>
            <Text style={styles.filterBtn__text}>From: DATE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn} underlayColor="white" onPress={this.onPressHistory}>
            <Text style={styles.filterBtn__text}>To: DATE</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.filterBtns}>
          <Text style={styles.filterBtn__label}>Group by:</Text>
          <TouchableOpacity style={styles.filterBtn} underlayColor="white" onPress={this.onPressHistory}>
            <Text style={styles.filterBtn__text}>Date</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn} underlayColor="white" onPress={this.onPressCategories}>
            <Text style={styles.filterBtn__text}>Categories</Text>
          </TouchableOpacity>
        </View>
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
