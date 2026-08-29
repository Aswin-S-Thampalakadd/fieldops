import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";

const CustomDrawerContent = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.userInfoSection}>
          <View style={styles.userAvatar}>
            <Image
              source={{ uri: "https://via.placeholder.com/80" }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@example.com</Text>
          <View style={styles.userStats}>
            <View style={styles.userStat}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.userStat}>
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.userStat}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        <View style={styles.drawerItems}>
          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="home-outline" size={22} color="#333" />
            <Text style={styles.drawerItemText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="briefcase-outline" size={22} color="#333" />
            <Text style={styles.drawerItemText}>My Jobs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="time-outline" size={22} color="#333" />
            <Text style={styles.drawerItemText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="calendar-outline" size={22} color="#333" />
            <Text style={styles.drawerItemText}>Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="people-outline" size={22} color="#333" />
            <Text style={styles.drawerItemText}>Technicians</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="settings-outline" size={22} color="#333" />
            <Text style={styles.drawerItemText}>Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={22} color="#ff4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userInfoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
  },
  userAvatar: {
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0e0e0",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  userStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  userStat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#006666",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  drawerItems: {
    paddingTop: 10,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  drawerItemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 16,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#ff4444",
    marginLeft: 16,
    fontWeight: "600",
  },
});

export default CustomDrawerContent;
