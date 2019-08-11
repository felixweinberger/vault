import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import uuidv4 from 'uuid/v4';

import Numpad from '../components/Numpad';
import AddAmount from '../components/AddAmount';
import { updateEntities } from '../redux/actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
});

class AddExpenseAmountScreen extends React.Component {
  static navigationOptions = {
    title: 'Add',
  };

  state = {
    cents: 0,
    pretty: '0.00',
    current: this.props.state.entities.current,
    currencies: this.props.state.entities.currencies,
  };

  convertCentsToMainCurrency = (cents) => {
    const mainPerEuro = this.state.currencies[this.state.current.mainCurrency].fxRatePerEuro;
    const currentPerEuro = this.state.currencies[this.state.current.currency].fxRatePerEuro;
    return cents * (mainPerEuro / currentPerEuro);
  }

  updateLocalState = (cents) => {
    const padded = cents.toFixed(0).toString().padStart(3, '0');
    const preComma = padded.slice(0, padded.length - 2);
    const postComma = padded.slice(padded.length - 2);
    const pretty = `${preComma}.${postComma}`;
    this.convertCentsToMainCurrency(cents);
    this.setState({
      cents,
      pretty,
      current: {
        ...this.state.current,
        amount: cents / 100,
        inMainCurrency: this.convertCentsToMainCurrency(cents) / 100,
      },
    });
  }

  onFocus = () => {
    this.updateLocalState(this.props.state.entities.current.amount * 100);
    this.setState({ current: { ...this.props.state.entities.current } });
  }

  onNumpadPress = (value) => {
    if (typeof value === 'number') {
      const cents = Number(this.state.cents.toFixed(0).toString() + value.toString());
      this.updateLocalState(cents);
    } else if (value === '⇤') {
      const centString = this.state.cents.toFixed(0).toString();
      const cents = Number(centString.slice(0, centString.length - 1));
      this.updateLocalState(cents);
    } else if (value === '↩︎') {
      const currentUpdate = { current: { ...this.state.current } };
      currentUpdate.current.id = uuidv4();
      delete currentUpdate.current.cents;
      delete currentUpdate.current.pretty;
      this.props.updateEntities(currentUpdate);
      this.props.navigation.navigate('AddDetails');
    }
  }

  onCurrencyPress = () => {
    this.props.navigation.navigate('SelectCurrency', { isGlobalChange: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this.onFocus} />
        <AddAmount
          value={this.state.pretty}
          currency={this.state.current.currency}
          symbol={this.state.currencies[this.state.current.currency].symbol}
          onCurrencyPress={this.onCurrencyPress}
        />
        <Numpad onNumpadPress={this.onNumpadPress} />
      </View>
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
)(AddExpenseAmountScreen);
