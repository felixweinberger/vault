import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import NumpadButton from './NumpadButton';

const styles = StyleSheet.create({
  numpad: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  numpadLeft: {
    flex: 3,
  },
  numpad__oneToNine: {
    flex: 3,
  },
  numpad__row: {
    flex: 1,
    flexDirection: 'row',
  },
  numpad__number: {
    flex: 1,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  numpad__zeroComma: {
    flex: 1,
    flexDirection: 'row',
  },
  numpad__zero: {
    flex: 2,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  numpad__comma: {
    flex: 1,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  numpadRight: {
    flex: 1,
  },
  numpad__back: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  numpad__submit: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgreen',
    borderWidth: 0.5,
    borderColor: '#fff',
  },
});

export default function Numpad() {
  return (
    <View style={styles.numpad}>
      <View style={styles.numpadLeft}>
        <View style={styles.numpad__oneToNine}>
          <View style={styles.numpad__row}>
            <NumpadButton value={1} style={styles.numpad__number} />
            <NumpadButton value={2} style={styles.numpad__number} />
            <NumpadButton value={3} style={styles.numpad__number} />
          </View>
          <View style={styles.numpad__row}>
            <NumpadButton value={4} style={styles.numpad__number} />
            <NumpadButton value={5} style={styles.numpad__number} />
            <NumpadButton value={6} style={styles.numpad__number} />
          </View>
          <View style={styles.numpad__row}>
            <NumpadButton value={7} style={styles.numpad__number} />
            <NumpadButton value={8} style={styles.numpad__number} />
            <NumpadButton value={9} style={styles.numpad__number} />
          </View>
        </View>
        <View style={styles.numpad__zeroComma}>
          <NumpadButton value={0} style={styles.numpad__zero} />
          <NumpadButton value={','} style={styles.numpad__comma} />
        </View>
      </View>
      <View style={styles.numpadRight}>
        <NumpadButton value={'⇤'} style={styles.numpad__back} />
        <NumpadButton value={'↩︎'} style={styles.numpad__submit} />
      </View>
    </View>
  );
}
