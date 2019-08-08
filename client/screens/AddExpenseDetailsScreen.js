import React from "react";
import { connect } from "react-redux";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import { NavigationEvents } from "react-navigation";
import { Icon } from "expo";

import { updateEntities } from "../redux/actions";
import DatePicker from "../components/DatePicker";
import Colors from "../constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    justifyContent: "space-between"
  },
  amount: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.totalBackground,
    fontWeight: "bold"
  },
  amount__text: {
    color: "white",
    fontSize: 16
  },
  amount__value: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16
  },
  options: {
    flexGrow: 7
  },
  option: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
    alignItems: "center"
  },
  option__text: {
    fontSize: 16
  },
  category: {
    flex: 5,
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 20
  },
  category__label: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  category__scrollview: {
    flexGrow: 2
  },
  category__list: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  category__listitem: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    color: Colors.orange6,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.orange6,
    fontSize: 16
  },
  actions: {
    flex: 2
  },
  add: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.addButton
  },
  cancel: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.cancelButton
  },
  action__text: {
    color: "white",
    fontSize: 16
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: Colors.orange6,
    borderBottomWidth: 1,
  },
  input: {
    paddingVertical: 5,
    flex: 1,
    fontSize: 16
  }
});

class AddExpenseDetailsScreen extends React.Component {
  static navigationOptions = {
    title: "Details"
  };

  state = {
    amount: 0,
    currency: "EUR",
    date: null,
    currencies: this.props.state.entities.currencies,
    category: null
  };

  onFocus = () => {
    const timestamp = new Date().toISOString();
    this.setState({
      ...this.props.state.entities.current,
      date: this.computeSimpleDate(timestamp)
    });
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

  computeCategories = categories => {
    const categoryList = Object.keys(categories).sort(
      (a, b) => categories[b] - categories[a]
    );
    const categoryBtns = categoryList
      .filter(cat => {
        if (!this.state.category) return true;
        const lowerCat = cat.toLowerCase();
        const lowerInput = this.state.category.toLowerCase();
        return lowerCat.indexOf(lowerInput) !== -1;
      })
      .map(cat => (
        <TouchableOpacity
          key={cat}
          onPress={() => this.setState({ category: cat })}
        >
          <Text style={styles.category__listitem}>{cat}</Text>
        </TouchableOpacity>
      ));
    return categoryBtns;
  };

  onAdd = () => {
    if (this.state.category != null) {
      const newExpense = {
        expenses: {},
        categories: {}
      };
      const propCat = this.props.state.entities.categories;
      newExpense.categories[this.state.category] = propCat[this.state.category]
        ? this.props.state.entities.categories[this.state.category] + 1
        : 1;
      newExpense.expenses[this.state.id] = { ...this.state };
      delete newExpense.expenses[this.state.id].currencies;
      this.props.updateEntities(newExpense);
      this.onCancel();
    } else {
      Alert.alert("Please enter a category.");
    }
  };

  onCancel = () => {
    const clearCurrent = { current: { amount: 0, inMainCurrency: 0 } };
    this.props.updateEntities(clearCurrent);
    this.props.navigation.navigate("AddAmount");
  };

  onDateChange = date => {
    this.setState({ date });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <NavigationEvents onWillFocus={this.onFocus} />
        <View style={styles.amount}>
          <Text style={styles.amount__text}>New expense: </Text>
          <Text style={styles.amount__value}>
            {`${this.state.amount.toFixed(2)} ${this.state.currency} (${
              this.state.currencies[this.state.currency].symbol
            })`}
          </Text>
        </View>
        <View style={styles.options}>
          <View style={styles.category}>
            <View style={styles.category__label}>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Category (required)"
                  value={this.state.category ? this.state.category : null}
                  onChangeText={category => this.setState({ category })}
                  style={styles.input}
                />
                {this.state.category && (
                  <Icon.Ionicons
                    name={"ios-backspace"}
                    size={26}
                    style={styles.backBtn}
                    onPress={() => this.setState({ category: null })}
                  />
                )}
              </View>
            </View>
            <ScrollView
              style={styles.category__scrollview}
              contentContainerStyle={styles.category__list}
            >
              {this.computeCategories(this.props.state.entities.categories)}
            </ScrollView>
          </View>
          <View style={styles.option}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Comment"
                value={this.state.comment ? this.state.comment : null}
                onChangeText={comment => this.setState({ comment })}
                style={styles.input}
              />
              {this.state.comment && (
                <Icon.Ionicons
                  name={"ios-backspace"}
                  size={26}
                  style={styles.backBtn}
                  onPress={() => this.setState({ comment: null })}
                />
              )}
            </View>
          </View>
          <View style={styles.option}>
            <Text style={styles.option__text}>Date</Text>
            <DatePicker
              date={this.state.date}
              onDateChange={this.onDateChange}
            />
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.add}
            underlayColor="white"
            onPress={this.onAdd}
          >
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
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({ state });

const mapDispatchToProps = dispatch => ({
  updateEntities: entities => dispatch(updateEntities(entities))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddExpenseDetailsScreen);
