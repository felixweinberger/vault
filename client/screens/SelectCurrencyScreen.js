import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet, Text, FlatList, TouchableOpacity, View,
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

  onPress = (currency) => {
    // if in settings, alert user that changes all currencies!
    this.props.updateEntities({
      // settings: { mainCurrency: currency },
      current: { currency },
    });
    this.props.navigation.navigate('Settings');
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
          <Text style={styles.currency__rb}>{fxRatePerMainCurrency.toPrecision(5)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  keyExtractor = item => item.id;

  render() {
    const currencies = Object.values(this.props.state.entities.currencies)
      .sort((a, b) => a.name.localeCompare(b.name));

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
