import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [activeJobs, setActiveJobs] = useState(12);
  const [pendingJobs, setPendingJobs] = useState(5);
  const [completedJobs, setCompletedJobs] = useState(45);

  const upcomingJobs = [
    {
      id: 1,
      title: "AC Repair",
      address: "123 Main St, Apt 4B",
      time: "2:30 PM",
    },
    { id: 2, title: "Plumbing Fix", address: "456 Oak Ave", time: "4:00 PM" },
    {
      id: 3,
      title: "Electrical Wiring",
      address: "789 Pine Rd",
      time: "6:15 PM",
    },
    {
      id: 4,
      title: "Appliance Installation",
      address: "321 Elm St",
      time: "8:00 PM",
    },
  ];

  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [8, 12, 7, 15, 10, 14, 9],
        color: (opacity = 1) => `rgba(0, 139, 139, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>John Doe</Text>
        </View>

        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={26} color="#333" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.activeCard]}>
            <Ionicons name="briefcase" size={28} color="#fff" />
            <Text style={styles.statNumber}>{activeJobs}</Text>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </View>

          <View style={[styles.statCard, styles.pendingCard]}>
            <Ionicons name="time" size={28} color="#fff" />
            <Text style={styles.statNumber}>{pendingJobs}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={[styles.statCard, styles.completedCard]}>
            <Ionicons name="checkmark-circle" size={28} color="#fff" />
            <Text style={styles.statNumber}>{completedJobs}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Weekly Performance</Text>
          <LineChart
            data={weeklyData}
            width={width - 40}
            height={200}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 139, 139, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#006666",
              },
            }}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
          />
        </View>

        <View style={styles.upcomingContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Jobs</Text>
            <TouchableOpacity onPress={() => navigation.navigate("AllJobs")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {upcomingJobs.map((job) => (
            <TouchableOpacity key={job.id} style={styles.jobCard}>
              <View style={styles.jobIconContainer}>
                <Ionicons name="construct" size={24} color="#006666" />
              </View>
              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={styles.jobDetails}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.jobAddress}>{job.address}</Text>
                </View>
                <View style={styles.jobDetails}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.jobTime}>{job.time}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.jobAction}>
                <Ionicons name="chevron-forward" size={24} color="#006666" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionItem}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="add-circle" size={28} color="#006666" />
              </View>
              <Text style={styles.quickActionText}>New Job</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="search" size={28} color="#006666" />
              </View>
              <Text style={styles.quickActionText}>Find Job</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="calendar" size={28} color="#006666" />
              </View>
              <Text style={styles.quickActionText}>Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="stats-chart" size={28} color="#006666" />
              </View>
              <Text style={styles.quickActionText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
  },
  greeting: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 2,
  },
  notificationButton: {
    padding: 4,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeCard: {
    backgroundColor: "#006666",
  },
  pendingCard: {
    backgroundColor: "#ff8c00",
  },
  completedCard: {
    backgroundColor: "#2e7d32",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
    fontWeight: "500",
  },
  chartContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  upcomingContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    color: "#006666",
    fontWeight: "600",
    fontSize: 14,
  },
  jobCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  jobIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e6f3f3",
    justifyContent: "center",
    alignItems: "center",
  },
  jobInfo: {
    flex: 1,
    marginLeft: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  jobDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  jobAddress: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  jobTime: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  jobAction: {
    padding: 8,
  },
  quickActionsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  quickActionItem: {
    alignItems: "center",
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e6f3f3",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionText: {
    fontSize: 12,
    color: "#333",
    marginTop: 6,
    fontWeight: "500",
  },
});

export default HomeScreen;
