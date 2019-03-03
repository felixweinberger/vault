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
    textAlign: 'right',
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
  },
  item__date: {
    textAlign: 'right',
    fontStyle: 'italic',
    color: 'grey',
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default function History(props) {
  const renderItem = ({ item }) => {
    const swipeoutBtns = [
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

    let amount;
    if (props.list === 'history') {
      amount = (
        <View>
          <Text style={styles.item__amount}>{`${item.amount.toFixed(2)} ${item.currency}`}</Text>
        </View>
      );
    } else if (props.list === 'categories') {
      amount = (
        <View>
          <Text style={styles.item__amount}>{`${item.amount.toFixed(2)} ${item.currency}`}</Text>
          <Text style={styles.item__date}>{`${item.date}`}</Text>
        </View>
      );
    }

    return (
      <Swipeout right={swipeoutBtns}>
        <View style={styles.item}>
          {label}
          {amount}
        </View>
      </Swipeout>
    );
  };

  const renderHeader = ({ section }) => {
    const sectionTotal = section.data
      .reduce((acc, el) => (acc * 100 + el.inMainCurrency * 100) / 100, 0);

    return (
      <View style={styles.header}>
        <Text style={styles.header__text}>{section.title}</Text>
        <Text style={styles.header__text}>{sectionTotal.toFixed(2)} EUR</Text>
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
