import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView, StyleSheet, View, Text, TouchableOpacity, Switch,
} from 'react-native';

import { modifySettings } from '../redux/actions';

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

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    return (
      <ScrollView style={styles.options} contentContainerStyle={styles.optionsContainer}>
        <View style={styles.option}>
          <Text>Currency</Text>
          <TouchableOpacity underlayColor="white">
            <Text>Button</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text>FaceID / TouchID</Text>
          <Switch />
        </View>
        <View style={styles.option}>
          <Text>Import .csv</Text>
          <TouchableOpacity underlayColor="white">
            <Text>Button</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.option}>
          <Text>Export .csv</Text>
          <TouchableOpacity underlayColor="white">
            <Text>Button</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  currentExpense: state.settings,
});

const mapDispatchToProps = dispatch => ({
  modifySettings: settings => dispatch(modifySettings(settings)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsScreen);
