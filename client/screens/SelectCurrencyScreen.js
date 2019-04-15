import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet, Text, FlatList, TouchableOpacity, View, Alert,
} from 'react-native';

import { updateEntities } from '../redux/actions';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  currency: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currency__left: {
    paddingLeft: 10,
  },
  currency__right: {
    paddingRight: 10,
  },
  currency__lt: {
    fontWeight: 'bold',
  },
  currency__lb: {
    color: Colors.orange6,
    fontStyle: 'italic',
  },
  currency__rt: {
    textAlign: 'right',
    fontWeight: 'bold',
  },
  currency__rb: {
    color: Colors.orange6,
    textAlign: 'right',
    fontStyle: 'italic',
  },
});

class SelectCurrencyScreen extends React.Component {
  static navigationOptions = {
    title: 'Select currency',
  };

  state = {
    mainCurrency: this.props.state.entities.settings.mainCurrency,
    currencies: this.props.state.entities.currencies,
  };

  changeMainCurrency = (newMainCurrency) => {
    this.props.updateEntities({ settings: { mainCurrency: newMainCurrency } });
    const updatedExpenses = { ...this.props.state.entities.expenses };
    Object.values(this.props.state.entities.expenses)
      .forEach((expense) => {
        const newMainCurrencyPerEuro = this.state.currencies[newMainCurrency].fxRatePerEuro;
        const expenseCurrencyPerEuro = this.state.currencies[expense.currency].fxRatePerEuro;
        const fxRatePerNewMainCurrency = expenseCurrencyPerEuro / newMainCurrencyPerEuro;
        updatedExpenses[expense.id].inMainCurrency = +((updatedExpenses[expense.id].amount
          / fxRatePerNewMainCurrency).toFixed(2));
        updatedExpenses[expense.id].mainCurrency = newMainCurrency;
      });
    this.props.updateEntities({
      expenses: { ...updatedExpenses },
      current: { currency: newMainCurrency },
    });
    this.props.navigation.goBack();
  }

  onPress = (currency) => {
    const isGlobalChange = this.props.navigation.getParam('isGlobalChange', false);
    if (isGlobalChange) {
      Alert.alert(
        'Currency change',
        'Changing the home currency recalculates all expenses in the new currency at today\'s exchange rate. '
        + '\n\nThis allows totals to be displayed correctly in the new home currency.'
        + '\n\nThe original currency amounts will remain, but historical exchange rates will be lost in favor of current exchange rates.'
        + '\n\nAre you sure you want to change the home currency?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => this.changeMainCurrency(currency),
          },
        ],
      );
    } else {
      this.props.updateEntities({
        current: { currency },
      });
      this.props.navigation.goBack();
    }
  }

  renderCurrency = ({ item }) => {
    const mainCurrencyPerEuro = this.state.currencies[this.state.mainCurrency].fxRatePerEuro;
    const fxRatePerMainCurrency = item.fxRatePerEuro / mainCurrencyPerEuro;
    return (
      <TouchableOpacity style={styles.currency} onPress={() => this.onPress(item.id)}>
        <View style={styles.currency__left}>
          <Text style={styles.currency__lt}>{item.name}</Text>
          <Text style={styles.currency__lb}>{item.id}</Text>
        </View>
        <View style={styles.currency__right}>
          <Text style={styles.currency__rt}>{item.symbol}</Text>
          <Text style={styles.currency__rb}>
            1 {this.state.mainCurrency} = {fxRatePerMainCurrency.toPrecision(5)} {item.id}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  keyExtractor = item => item.id;

  render() {
    const currencies = Object.values(this.props.state.entities.currencies)
      .sort((a, b) => a.id.localeCompare(b.id));

    return (
      <FlatList
        style={styles.flatList}
        data={currencies}
        renderItem={this.renderCurrency}
        keyExtractor={this.keyExtractor}
      />
    );
  }
}

const mapStateToProps = state => ({ state });

const mapDispatchToProps = dispatch => ({
  updateEntities: entities => dispatch(updateEntities(entities)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectCurrencyScreen);
