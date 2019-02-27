import React from 'react';
import { Text } from 'react-native';

export default class MonoText extends React.Component {
  render() {
    return <Text {...this.props} style={{ fontFamily: 'space-mono' }} />;
  }
}
