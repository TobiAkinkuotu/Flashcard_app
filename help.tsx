import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Help() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendFeedback = async () => {
    if (!message.trim()) {
      setStatus("Message cannot be empty.");
      return;
    }

    setStatus("Sending...");

    try {
      const response = await fetch("https://formspree.io/f/xanvoqko", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        setStatus("Feedback sent successfully!");
        setMessage("");
      } else {
        setStatus("Failed to send feedback.");
      }
    } catch (error) {
      setStatus("Network error.");
    }
  };

  return (
    <View style={{ flex: 1 }}>

      <View style={styles.header}>
        <Ionicons name="help-circle" size={22} color="#fff" />
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
      </View>

      <ScrollView style={styles.container}>

        <Text style={styles.bigText}>How can we help you today?</Text>


        <Text style={styles.sectionTitle}>
          <Ionicons name="book-outline" size={20} /> Getting Started
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardText}>• Navigate through the bottom tabs.</Text>
          <Text style={styles.cardText}>• Select any quiz to begin learning.</Text>
          <Text style={styles.cardText}>• Track your streak and progress.</Text>
        </View>



        <Text style={styles.sectionTitle}>
          <Ionicons name="stats-chart-outline" size={20} /> Scoring & Progress
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardText}>• Correct answers increase accuracy.</Text>
          <Text style={styles.cardText}>• Daily practice builds your streak.</Text>
          <Text style={styles.cardText}>• Completed quizzes appear in history.</Text>
        </View>



        <Text style={styles.sectionTitle}>
          <Ionicons name="call-outline" size={20} /> Support Contact
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardText}>Email: pauladegboye1@gmail.com</Text>
          <Text style={styles.cardText}>Phone: +234 907 251 2235</Text>
        </View>


        <Text style={styles.sectionTitle}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} /> Send Feedback
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Type your feedback here..."
          placeholderTextColor="#888"
          multiline
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.button} onPress={sendFeedback}>
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>

        {status ? <Text style={styles.status}>{status}</Text> : null}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FF8800",
    paddingTop: 55,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  container: {
    padding: 20,
  },

  bigText: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 22,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#f3f3f3",
    padding: 18,
    borderRadius: 12,
    elevation: 2,
  },

  cardText: {
    fontSize: 15,
    marginBottom: 6,
    color: "#333",
  },

  input: {
    backgroundColor: "#f0f0f0",
    height: 140,
    padding: 15,
    borderRadius: 12,
    textAlignVertical: "top",
    fontSize: 15,
  },

  button: {
    backgroundColor: "#FF8800",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  status: {
    marginTop: 10,
    fontStyle: "italic",
    fontSize: 14,
  },
});