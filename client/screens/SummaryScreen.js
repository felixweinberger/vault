import React from "react";
import { connect } from "react-redux";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { NavigationEvents } from "react-navigation";
import { uniq } from "lodash";

import Colors from "../constants/Colors";
import { deleteExpense } from "../redux/actions";
import Summary from "../components/Summary";
import DatePicker from "../components/DatePicker";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerNone: {
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  headerNone__text: {
    color: "grey",
    fontStyle: "italic",
    fontSize: 16
  },
  headerTotal: {
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.greyDark
  },
  headerTotal__text: {
    color: "white",
    fontSize: 16
  },
  headerTotal__total: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },
  filterDate: {
    backgroundColor: Colors.greyDark,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    paddingLeft: 10,
    paddingRight: 10
  },
  filterGroups: {
    backgroundColor: Colors.greyDark,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    paddingLeft: 10,
    paddingRight: 10
  },
  filterBtn__label: {
    color: "white",
    fontWeight: "bold",
    paddingRight: 10,
    fontSize: 16
  },
  filterBtn__text: {
    color: "white",
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "white",
    fontSize: 16
  }
});

class SummaryScreen extends React.Component {
  static navigationOptions = {
    title: "Summary"
  };

  state = {
    list: "categories",
    fromDate: null,
    toDate: null,
    total: 0,
    currency: this.props.state.entities.settings.mainCurrency
  };

  computeSimpleDate = timestamp => {
    const date = new Date(timestamp);
    const dd = date
      .getDate()
      .toString()
      .padStart(2, "0");
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${yyyy}.${mm}.${dd}`;
  };

  computeSectionsByDate = () => {
    const expenseArr = Object.values(this.props.state.entities.expenses).filter(
      expense =>
        expense.date >= this.state.fromDate && expense.date <= this.state.toDate
    ).sort((a, b) => a.date < b.date);

    if (expenseArr.length > 0) {
      let total = 0;
      const dates = uniq(expenseArr.map(expense => expense.date));
      const sectionObj = dates.reduce((acc, date) => {
        acc[date] = { title: date, data: [] };
        return acc;
      }, {});
      expenseArr.forEach(expense => {
        sectionObj[expense.date].data.push(expense);
        total = (total * 100 + expense.inMainCurrency * 100) / 100;
      });
      return Object.values(sectionObj);
    }
    return [];
  };

  computeSectionsByCategory = () => {
    const expenseArr = Object.values(this.props.state.entities.expenses).filter(
      expense =>
        expense.date >= this.state.fromDate && expense.date <= this.state.toDate
    ).sort((a, b) => a.date < b.date);

    if (expenseArr.length > 0) {
      let total = 0;
      const categoryTotals = expenseArr.reduce((acc, el) => {
        acc[el.category] = acc[el.category]
          ? (acc[el.category] * 100 + el.inMainCurrency * 100) / 100
          : el.inMainCurrency;
        total = (total * 100 + el.inMainCurrency * 100) / 100;
        return acc;
      }, {});

      const sortedCategories = Object.keys(categoryTotals).sort(
        (a, b) => categoryTotals[b] - categoryTotals[a]
      );

      const sectionObj = sortedCategories.reduce((acc, category) => {
        acc[category] = { title: category, data: [] };
        return acc;
      }, {});

      expenseArr.forEach(expense => {
        sectionObj[expense.category].data.push(expense);
      });

      return Object.values(sectionObj);
    }
    return [];
  };

  computeTotal = sections => {
    const res = sections
      .map(section =>
        section.data.reduce(
          (acc, el) => (acc * 100 + el.inMainCurrency * 100) / 100,
          0
        )
      )
      .reduce((acc, el) => (acc * 100 + el * 100) / 100, 0);
    return res;
  };

  onFocus = () => {
    const timestamp = new Date().toISOString();
    const toDate = this.computeSimpleDate(timestamp);
    const fromDate = `${toDate.substring(0, toDate.length - 2)}01`;
    const { mainCurrency } = this.props.state.entities.settings;
    this.setState({ fromDate, toDate, currency: mainCurrency });
  };

  onDelete = expenseId => {
    this.props.deleteExpense(expenseId);
  };

  onPressHistory = () => {
    this.setState({ list: "history" });
  };

  onPressCategories = () => {
    this.setState({ list: "categories" });
  };

  onFromDateChange = date => {
    this.setState({ fromDate: date });
  };

  onToDateChange = date => {
    this.setState({ toDate: date });
  };

  render() {
    let sections;
    if (this.state.list === "history") {
      sections = this.computeSectionsByDate();
    } else if (this.state.list === "categories") {
      sections = this.computeSectionsByCategory();
    }

    const header = () => {
      if (sections.length === 0) {
        return (
          <View style={styles.headerNone}>
            <Text style={styles.headerNone__text}>
              There are no expenses for this period.
            </Text>
          </View>
        );
      }
      return (
        <View style={styles.headerTotal}>
          <Text style={styles.headerTotal__text}>Total: </Text>
          <Text style={styles.headerTotal__total}>
            {`${this.computeTotal(sections).toFixed(2)} ${
              this.state.currency
            } (${
              this.props.state.entities.currencies[this.state.currency].symbol
            })`}
          </Text>
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this.onFocus} />
        {header(sections)}
        <Summary
          sections={sections}
          onDelete={this.onDelete}
          list={this.state.list}
          mainCurrency={this.state.currency}
          currencies={this.props.state.entities.currencies}
        />
        <View style={styles.filterDate}>
          <Text style={styles.filterBtn__label}>From: </Text>
          <DatePicker
            date={this.state.fromDate}
            onDateChange={this.onFromDateChange}
            fontColor={"white"}
          />
          <Text style={styles.filterBtn__label}>To: </Text>
          <DatePicker
            date={this.state.toDate}
            onDateChange={this.onToDateChange}
            fontColor={"white"}
          />
        </View>
        <View style={styles.filterGroups}>
          <Text style={styles.filterBtn__label}>Group by:</Text>
          <TouchableOpacity
            style={styles.filterBtn}
            underlayColor="white"
            onPress={this.onPressHistory}
          >
            <Text style={styles.filterBtn__text}>Date</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterBtn}
            underlayColor="white"
            onPress={this.onPressCategories}
          >
            <Text style={styles.filterBtn__text}>Categories</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state });

const mapDispatchToProps = dispatch => ({
  deleteExpense: expenseId => dispatch(deleteExpense(expenseId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryScreen);
