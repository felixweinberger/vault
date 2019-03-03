import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView, StyleSheet, Text,
} from 'react-native';

import { updateEntities } from '../redux/actions';

const styles = StyleSheet.create({
  option: {
    flex: 1,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
  },
});

class SelectCurrencyScreen extends React.Component {
  static navigationOptions = {
    title: 'Select currency',
  };

  render() {
    return (
      <ScrollView style={styles.options} contentContainerStyle={styles.optionsContainer}>
        <Text>{JSON.stringify(this.props.state.entities.currencies)}</Text>
      </ScrollView>
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
