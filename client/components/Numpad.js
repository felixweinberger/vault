import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import NumpadButton from './NumpadButton';

const styles = StyleSheet.create({
  numpad: {
    flex: 1,
    flexDirection: 'row',
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
    marginBottom: -1,
  },
  numpad__number: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 50,
  },
  numpad__zeroComma: {
    flex: 1,
    flexDirection: 'row',
  },
  numpad__zero: {
    flex: 1,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numpadRight: {
    flex: 1,
  },
  numpad__back: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numpad__submit: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function Numpad(props) {
  return (
    <View style={styles.numpad}>
      <View style={styles.numpadLeft}>
        <View style={styles.numpad__oneToNine}>
          <View style={styles.numpad__row}>
            <NumpadButton value={1} style={[styles.numpad__number, { backgroundColor: '#ffab91' }]} onPress={props.onNumpadPress} />
            <NumpadButton value={2} style={[styles.numpad__number, { backgroundColor: '#ff8a65' }]} onPress={props.onNumpadPress} />
            <NumpadButton value={3} style={[styles.numpad__number, { backgroundColor: '#ff7043' }]} onPress={props.onNumpadPress} />
          </View>
          <View style={styles.numpad__row}>
            <NumpadButton value={4} style={[styles.numpad__number, { backgroundColor: '#ff8a65' }]} onPress={props.onNumpadPress} />
            <NumpadButton value={5} style={[styles.numpad__number, { backgroundColor: '#ff7043' }]} onPress={props.onNumpadPress} />
            <NumpadButton value={6} style={[styles.numpad__number, { backgroundColor: '#ff5722' }]} onPress={props.onNumpadPress} />
          </View>
          <View style={styles.numpad__row}>
            <NumpadButton value={7} style={[styles.numpad__number, { backgroundColor: '#ff7043' }]} onPress={props.onNumpadPress} />
            <NumpadButton value={8} style={[styles.numpad__number, { backgroundColor: '#ff5722' }]} onPress={props.onNumpadPress} />
            <NumpadButton value={9} style={[styles.numpad__number, { backgroundColor: '#f4511e' }]} onPress={props.onNumpadPress} />
          </View>
        </View>
        <View style={styles.numpad__zeroComma}>
          <NumpadButton value={0} style={[styles.numpad__zero, { backgroundColor: '#e64a19' }]} onPress={props.onNumpadPress} />
        </View>
      </View>
      <View style={styles.numpadRight}>
        <NumpadButton value={'⇤'} style={[styles.numpad__back, { backgroundColor: '#5d4037' }]} onPress={props.onNumpadPress} />
        <NumpadButton value={'↩︎'} style={[styles.numpad__submit, { backgroundColor: '#321911' }]} onPress={props.onNumpadPress} />
      </View>
    </View>
  );
}
