import React from "react";
import { Ionicons } from "@expo/vector-icons";
// import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeScreen from "./src/screens/HomeScreen";
import AllJobsScreen from "./src/screens/AllJobsScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import CustomDrawerContent from "./src/components/CustomDrawerContent";

const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="darkcyan"
      inactiveColor="gray"
      barStyle={{
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="AllJobs"
        component={AllJobsScreen}
        options={{
          tabBarLabel: "My Jobs",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "briefcase" : "briefcase-outline"}
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#fff",
            width: 280,
          },
        }}
      >
        <Drawer.Screen name="MainTabs" component={MainTabs} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
