import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingTop: 30,
  },
  contentText: {
    fontSize: 17,
    color: Colors.placeholderText,
    lineHeight: 24,
    textAlign: 'center',
  },
});

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.contentText}>
          WIP: Settings page
        </Text>
      </ScrollView>
    );
  }
}
