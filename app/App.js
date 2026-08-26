import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text } from "react-native";

const Drawer = createDrawerNavigator();

function DummyScreen() {
  return (
    <View>
      <Text>Dummy</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="MainTabs" component={DummyScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
