import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import SummaryScreen from "../screens/SummaryScreen";
import AddExpenseAmountScreen from "../screens/AddExpenseAmountScreen";
import AddExpenseDetailsScreen from "../screens/AddExpenseDetailsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SelectCurrencyScreen from "../screens/SelectCurrencyScreen";
import Colors from "../constants/Colors";

const tabNavigatorConfig = {
  tabBarOptions: {
    activeTintColor: Colors.tintColor
  },
  initialRouteName: "AddExpenseStack"
};

const SummaryStack = createStackNavigator({
  Summary: SummaryScreen
});

SummaryStack.navigationOptions = {
  tabBarLabel: "Summary",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-stats" : "md-stats"}
    />
  )
};

const AddExpenseStack = createStackNavigator({
  AddAmount: AddExpenseAmountScreen,
  AddDetails: AddExpenseDetailsScreen,
  SelectCurrency: SelectCurrencyScreen
});

AddExpenseStack.navigationOptions = {
  tabBarLabel: "Add Expense",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-add-circle${focused ? "" : "-outline"}`
          : "md-add-circle"
      }
    />
  )
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
  SelectCurrency: SelectCurrencyScreen
});

SettingsStack.navigationOptions = {
  tabBarLabel: "Settings",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-options" : "md-options"}
    />
  )
};

export default createBottomTabNavigator(
  {
    SummaryStack,
    AddExpenseStack,
    SettingsStack
  },
  tabNavigatorConfig
);
