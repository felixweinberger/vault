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
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontWeight: 'bold',
    backgroundColor: Colors.orange6,
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

  const renderHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

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
