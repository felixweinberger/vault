import React from "react";
import { View, StyleSheet, Text, SectionList } from "react-native";
import Swipeout from "react-native-swipeout";

import Colors from "../constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    backgroundColor: Colors.orange6
  },
  header__text: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16
  },
  item: {
    flex: 1,
    flexDirection: "row",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.greyLight
  },
  item__category: {
    fontWeight: "bold",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16
  },
  item__comment: {
    fontStyle: "italic",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16
  },
  item__amount: {
    textAlign: "right",
    fontWeight: "bold",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16
  },
  item__date: {
    textAlign: "right",
    fontStyle: "italic",
    color: "grey",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16
  },
  deleteBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteBtnText: {
    color: 'white',
    fontSize: 16
  }
});

export default function Summary(props) {
  const renderItem = ({ item }) => {
    const deleteBtn = (
      <View style={styles.deleteBtn}>
        <Text style={styles.deleteBtnText}>Delete</Text>
      </View>
    )
    
    const swipeoutBtns = [
      {
        component: deleteBtn,
        backgroundColor: Colors.redDark,
        color: "white",
        onPress: () => props.onDelete(item.id)
      }
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

    const amount = (
      <View>
        <Text style={styles.item__amount}>
          {`${item.amount.toFixed(2)} ${item.currency} (${
            props.currencies[item.currency].symbol
          })`}
        </Text>
        {props.list === "categories" && (
          <Text style={styles.item__date}>{`${item.date}`}</Text>
        )}
      </View>
    );

    return (
      <Swipeout right={swipeoutBtns} autoClose={true}>
        <View style={styles.item}>
          {label}
          {amount}
        </View>
      </Swipeout>
    );
  };

  const renderHeader = ({ section }) => {
    const sectionTotal = section.data.reduce(
      (acc, el) => (acc * 100 + el.inMainCurrency * 100) / 100,
      0
    );

    return (
      <View style={styles.header}>
        <Text style={styles.header__text}>{section.title}</Text>
        <Text style={styles.header__text}>{`${sectionTotal.toFixed(2)} ${
          props.mainCurrency
        } (${props.currencies[props.mainCurrency].symbol})`}</Text>
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
