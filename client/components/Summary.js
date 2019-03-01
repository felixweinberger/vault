import React from 'react';
import {
  View, StyleSheet, Text, SectionList,
} from 'react-native';
import Swipeout from 'react-native-swipeout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#e64a19',
    color: 'white',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#efebe9',
  },
  item__text: {
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
        backgroundColor: 'darkred',
        color: 'white',
        // onPress: props.onDelete(item.id),
      },
    ];
    return (
      <Swipeout right={swipeoutBtns}>
        <View style={styles.item}>
          <Text style={styles.item__text}>{item.category}</Text>
          <Text style={styles.item__text}>{`${item.pretty} ${item.currency}`}</Text>
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
