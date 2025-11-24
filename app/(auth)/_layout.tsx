import { Slot } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

export default function AuthLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <Slot /> {/* Renders login or signup only */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
