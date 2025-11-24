// app/account.tsx
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function Account() {
  const user = {
    name: "Tobi",
    email: "akinkuotutobi6@gmail.com",
    avatar: "https://i.pravatar.cc/150?u=tobi",
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Account</Text>
        <Text style={styles.headerSubtitle}>Manage your personal info</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.card}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  email: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
});
