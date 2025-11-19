import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getUserProgress, Progress } from "./ProgressUpdater";

export default function App() {
  const [progress, setProgress] = useState<Progress>({
    completed: 0,
    accuracy: 0,
    streak: 0,
    totalCorrectAnswers: 0,
totalQuestionsAnswered:0,

  });

  const userId = "user876"; // match your Firestore rule

  // Fetch progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      const data = await getUserProgress(userId);
      if (data) setProgress(data);
    };
    fetchProgress();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={{ flex: 1 }}>
        {/* Orange header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
          <Text></Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.welcome}>Welcome back, Scholar!</Text>
          <Text style={styles.smallText}>Your Progress</Text>

          {/* Progress cards */}
          <View style={styles.progressRow}>
            <View style={styles.progressCard}>
              <Text style={styles.progressValue}>{progress.completed}</Text>
              <Text style={styles.progressLabel}>Completed</Text>
            </View>
            <View style={styles.progressCard}>
              <Text style={styles.progressValue}>{progress.accuracy}%</Text>
              <Text style={styles.progressLabel}>Accuracy</Text>
            </View>
            <View style={styles.progressCard}>
              <Text style={styles.progressValue}>{progress.streak} Days</Text>
              <Text style={styles.progressLabel}>Streak</Text>
            </View>
          </View>

          {/* Recommended section */}
          <Text style={styles.sectionTitle}>Recommended for you</Text>

          <Link href="/flashcard" style={styles.card}>
            <View style={styles.cardColorBox} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Basic Math Flashcards</Text>
              <Text style={styles.cardSubtitle}>
                Addition, Subtraction, Multiplication
              </Text>
            </View>
          </Link>
          <Link href="/history" style={styles.card}>
          
            <View style={styles.cardColorBox} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>History Quiz: World War II</Text>
              <Text style={styles.cardSubtitle}>
                Test your knowledge on key events.
              </Text>
          </View>
           </Link>

          {/* Previous activities */}
          <Text style={styles.sectionTitle}>
            <Ionicons name="timer-outline" size={20} /> Previous Activities
          </Text>

          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>Physics Chapter 1 Notes</Text>
            <Text style={styles.activitySubtitle}>Page 1/30</Text>
          </View>

          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>English Vocab FlashCard: Level 1</Text>
            <Text style={styles.activitySubtitle}>Completed 3 days ago</Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: "100%" },
  header: { backgroundColor: "#FF9800", paddingTop: 40, paddingBottom: 26, paddingHorizontal: 16 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  content: { flex: 1 },
  welcome: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  smallText: { fontSize: 12, color: "#777", marginBottom: 8 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  progressCard: { flex: 1, backgroundColor: "#F5F5F5", padding: 12, borderRadius: 8, alignItems: "center", marginHorizontal: 4 },
  progressValue: { fontSize: 18, fontWeight: "bold" },
  progressLabel: { fontSize: 12, color: "#555", marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, marginTop: 8 },
  card: { flexDirection: "row", borderWidth: 1, borderColor: "#DDD", borderRadius: 8, padding: 12, marginBottom: 8, alignItems: "center" },
  cardColorBox: { width: 40, height: 40, borderRadius: 6, backgroundColor: "#00BCD4", marginRight: 12 },
  cardTitle: { fontWeight: "bold", marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: "#555" },
  activityCard: { borderWidth: 1, borderColor: "#EEE", borderRadius: 8, padding: 12, marginBottom: 8 },
  activityTitle: { fontWeight: "bold" },
  activitySubtitle: { fontSize: 12, color: "#777", marginTop: 4 },
});
