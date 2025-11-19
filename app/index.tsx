import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const handleEditProfile = () => {
    console.log("Edit Profile tapped");
  };

  const handleLogout = () => {
    console.log("Logout tapped");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Account</Text>
          <Text style={styles.headerSubtitle}>Manage Account</Text>
        </View>
        <MaterialIcons name="more-vert" size={24} color="#fff" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: "https://i.pravatar.cc/200?img=5" }}
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
          <Text style={styles.name}>Emily Johnson</Text>
          <Text style={styles.email}>emily.johnson@example.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Subscription</Text>
          <View style={styles.subscriptionRow}>
            <Ionicons name="star" size={16} color="#1e88e5" />
            <Text style={styles.subscriptionTier}>Premium</Text>
            <Text style={styles.subscriptionMeta}>(Renews 12/24)</Text>
          </View>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleEditProfile}
          style={[styles.button, styles.buttonLight]}
        >
          <Text style={[styles.buttonText, styles.buttonTextDark]}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleLogout}
          style={[styles.button, styles.buttonPrimary]}
        >
          <View style={styles.buttonContentRow}>
            <Text style={styles.buttonText}>Logout</Text>
            <MaterialCommunityIcons
              name="logout"
              size={18}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.tabBar}>
        <View style={styles.tabItem}>
          <Ionicons name="home-outline" size={22} color="#666" />
          <Text style={styles.tabLabel}>Home</Text>
        </View>
        <View style={styles.tabItem}>
          <Ionicons name="sparkles-outline" size={22} color="#666" />
          <Text style={styles.tabLabel}>AI</Text>
        </View>
        <View style={styles.tabItemActive}>
          <Ionicons name="person" size={22} color="#ff9800" />
          <Text style={styles.tabLabelActive}>Account</Text>
        </View>
        <View style={styles.tabItem}>
          <Ionicons name="document-text-outline" size={22} color="#666" />
          <Text style={styles.tabLabel}>Docs</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const ORANGE = "#ff9800";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: ORANGE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#ffe0b2",
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  avatarWrapper: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: ORANGE,
    overflow: "hidden",
    marginBottom: 16,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 12,
    color: "#888",
  },
  section: {
    marginTop: 8,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    color: "#555",
    marginBottom: 6,
  },
  subscriptionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  subscriptionTier: {
    color: "#1e88e5",
    fontWeight: "700",
    marginLeft: 6,
  },
  subscriptionMeta: {
    color: "#999",
    marginLeft: 6,
    fontSize: 12,
  },
  button: {
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  buttonContentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonLight: {
    backgroundColor: "#e0e0e0",
  },
  buttonPrimary: {
    backgroundColor: ORANGE,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  buttonTextDark: {
    color: "#333",
  },
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e5e5",
    backgroundColor: "#fafafa",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 8,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabItemActive: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    color: "#666",
    fontSize: 11,
    marginTop: 2,
  },
  tabLabelActive: {
    color: ORANGE,
    fontSize: 11,
    marginTop: 2,
    fontWeight: "700",
  },
});

