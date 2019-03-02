import React from 'react';
import {
  View, StyleSheet, Text, SectionList,
} from 'react-native';
import Swipeout from 'react-native-swipeout';

import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    backgroundColor: Colors.orange6,
  },
  header__text: {
    fontWeight: 'bold',
    color: 'white',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.greyLight,
  },
  item__category: {
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
  },
  item__comment: {
    fontStyle: 'italic',
    paddingLeft: 10,
    paddingRight: 10,
  },
  item__amount: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default function Summary(props) {
  const prettifyAmount = (amount) => {
    const padded = amount.toString().padStart(3, '0');
    const preComma = padded.slice(0, padded.length - 2);
    const postComma = padded.slice(padded.length - 2);
    return `${preComma}.${postComma}`;
  };

  const renderItem = ({ item }) => {
    const swipeoutBtns = [
      // { text: 'Edit', backgroundColor: 'skyblue', color: 'white' },
      {
        text: 'Delete',
        backgroundColor: Colors.redDark,
        color: 'white',
        onPress: () => props.onDelete(item.id),
      },
    ];

    let label;
    if (item.comment) {
      label = (
          <View>
            <Text style={styles.item__category}>{item.category}</Text>
            <Text style={styles.item__comment}>{item.comment}</Text>
          </View>
      );
    } else {
      label = (
          <View>
            <Text style={styles.item__category}>{item.category}</Text>
          </View>
      );
    }

    return (
      <Swipeout right={swipeoutBtns}>
        <View style={styles.item}>
          {label}
          <Text style={styles.item__amount}>{`${item.pretty} ${item.currency}`}</Text>
        </View>
      </Swipeout>
    );
  };

  const renderHeader = ({ section }) => {
    const sectionTotal = section.data.reduce((acc, el) => acc + el.amount, 0);

    return (
      <View style={styles.header}>
        <Text style={styles.header__text}>{section.title}</Text>
        <Text style={styles.header__text}>{prettifyAmount(sectionTotal)} € EUR</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={props.sections}
        renderItem={renderItem}
        renderSectionHeader={renderHeader}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
}
