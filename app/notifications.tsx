import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const notifications = [
{ id: 1, title: "Study Reminder", message: "Don’t forget your 5-minute revision today!" },
{ id: 2, title: "New Flashcards Added", message: "You added 12 new cards to 'Biology Basics'." },
{ id: 3, title: "Streak Update", message: "🔥 You’re on a 3-day study streak! Keep it going!" },
];

export default function NotificationsPage() {
return (
   <View style={styles.container}>
   <Text style={styles.header}>Notifications</Text>

   <ScrollView style={styles.list}>
      {notifications.map((item) => (
         <TouchableOpacity key={item.id} style={styles.card}>
         <Text style={styles.title}>{item.title}</Text>
         <Text style={styles.body}>{item.message}</Text>
         </TouchableOpacity>
      ))}
   </ScrollView>
   </View>
);
}

const styles = StyleSheet.create({
container: {
   flex: 1,
   backgroundColor: "#f5f5f5",
   paddingHorizontal: 20,
   paddingTop: 60,
},
header: {
   fontSize: 28,
   fontWeight: "700",
   marginBottom: 20,
},
list: {
   flex: 1,
},
card: {
   backgroundColor: "white",
   padding: 16,
   borderRadius: 12,
   marginBottom: 12,
   shadowColor: "#000",
   shadowOpacity: 0.1,
   shadowRadius: 4,
   shadowOffset: { width: 0, height: 2 },
   elevation: 3,
},
title: {
   fontSize: 16,
   fontWeight: "600",
   marginBottom: 4,
},
body: {
   fontSize: 14,
   color: "#444",
},
});